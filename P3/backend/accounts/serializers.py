from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Contact


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_verify = serializers.CharField(write_only=True, required=True)
        
    class Meta:
        model = User
        fields = ('username', 'password', 'password_verify', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_verify']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        
class UserUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_verify = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('password', 'password_verify', 'email', 'first_name', 'last_name')
        
    def validate(self, attrs):
        if 'password' in attrs:
            if not attrs.get('password_verify'):
                raise serializers.ValidationError({"password_verify": "This field is required when providing a password."})

            if attrs['password'] != attrs['password_verify']:
                raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

class ContactsSerializer(serializers.ModelSerializer):
    id = UserViewSerializer(read_only=True)
    owner = UserViewSerializer(read_only=True)
    contact = UserViewSerializer(read_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'owner', 'contact']
        
class AddContactSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()

    def validate_username_or_email(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this username or email does not exist.")

        request_user = self.context['request'].user
        if user == request_user:
            raise serializers.ValidationError("You cannot add yourself as a contact.")

        if Contact.objects.filter(owner=request_user, contact=user).exists():
            raise serializers.ValidationError("Contact already exists.")

        return user

    def create(self, validated_data):
        request_user = self.context['request'].user
        contact_user = validated_data['username_or_email']

        contact = Contact.objects.create(owner=request_user, contact=contact_user)
        return str(contact)
    
class DeleteContactSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()

    def validate_username_or_email(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this username or email does not exist.")
        
        request_user = self.context['request'].user
        if user == request_user:
            raise serializers.ValidationError("You cannot delete yourself as a contact.")

        return user

    def delete_contact(self):
        validated_data = self.validated_data
        user = validated_data['username_or_email']
        request_user = self.context['request'].user

        try:
            contact = Contact.objects.get(owner=request_user, contact=user)
        except Contact.DoesNotExist:
            raise serializers.ValidationError("Contact not found")

        contact.delete()
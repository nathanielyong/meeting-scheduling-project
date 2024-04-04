from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q
from django.http import JsonResponse
from .models import Availability


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class UserProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserViewSerializer(user)
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class UserProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserViewSerializer(user)
        return Response(serializer.data)
    
@permission_classes([IsAuthenticated])
class UserProfileEdit(APIView):
    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
class AddContactView(APIView):
    def post(self, request):
        serializer = AddContactSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            contact_data = serializer.save()

            return Response(contact_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
class DeleteContactView(APIView):
    def post(self, request, format=None):
        serializer = DeleteContactSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.delete_contact()
            return Response({"detail": "Contact deleted successfully"}, status=204)

        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contacts(request):
    try:
        user = request.user
        contacts = Contact.objects.filter(owner=user)

        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                'contact_id': contact.id,
                'username': contact.contact.username,
                'email': contact.contact.email,
                'first_name': contact.contact.first_name,
                'last_name': contact.contact.last_name
            })

        return JsonResponse({'contacts': contacts_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_contacts(request, search_param):
    try:
        contacts = Contact.objects.filter(owner=request.user).filter(
            Q(contact__username=search_param) |
            Q(contact__email=search_param) |
            Q(contact__first_name=search_param) |
            Q(contact__last_name=search_param)
        )
        
        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                'contact_id': contact.id,
                'username': contact.contact.username,
                'email': contact.contact.email,
                'first_name': contact.contact.first_name,
                'last_name': contact.contact.last_name
            })

        return JsonResponse({'contacts': contacts_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_availability(request):
    try:
        data = request.data
        start_time = data.get("start_time")
        end_time = data.get("end_time")

        if start_time == None or end_time == None:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        Availability.objects.create(owner=request.user, start_time=start_time, end_time=end_time)
        return JsonResponse({'message': 'Availability created successfully'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_availabilities(request):
    try:
        availabilities = Availability.objects.filter(owner=request.user)
        availability_data = []
        for a in availabilities:
            availability_data.append({
                'start_time': a.start_time,
                'end_time': a.end_time
            })
        return JsonResponse({"availabilties": availability_data}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



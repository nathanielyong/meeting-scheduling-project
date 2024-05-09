from rest_framework import serializers
from .models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Meeting model.
    It contains the fields to be serialized.
    """
    class Meta:
        """
        This is the Meta class for the MeetingSerializer.
        It contains the model and fields to be serialized.
        """
        model = Meeting
        fields = [
            'id',
            'name',
            'description',
            'duration',
            'deadline',
            'meeting_time',
            ]

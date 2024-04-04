from .models import Calendar, Meeting
from accounts.models import Contact, Availability
from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from .serializers import MeetingSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_calendar(request):
    data = request.data
    name = data.get('name')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
   
    if not all([name, start_date, end_date]):
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    try:
        calendar = Calendar.objects.create(
            name=name,
            description=description,
            start_date=start_date,
            end_date=end_date,
            owner = request.user
        )

        return JsonResponse({'message': 'Calendar added successfully', 'calendar_id': calendar.id}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_calendars(request):    
    if request.method == "GET":
        try:
            user_calendars = Calendar.objects.filter(owner=request.user)
        
            calendars_data = []
            for calendar in user_calendars:
                calendars_data.append({
                    'id': calendar.id,
                    'name': calendar.name,
                    'description': calendar.description,
                    'start_date': calendar.start_date,
                    'end_date': calendar.end_date,
                })
        
            return JsonResponse({'calendars': calendars_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_calendar_details(request, calendar_id):
    try:
        calendar = Calendar.objects.get(id=calendar_id)
            
        if calendar.owner != request.user:
            return JsonResponse({'error': 'Cannot access another user\'s calendar'}, status=403)
        
        contact_list = []
        meeting_list = []
        for contact in calendar.contacts.all():
            contact_list.append({
                'id': contact.id,
                'username': contact.contact.username,
                'email': contact.contact.email,
                'first_name': contact.contact.first_name,
                'last_name': contact.contact.last_name
            })
        
        for meeting in calendar.meetings.all():
            meeting_list.append(MeetingSerializer(meeting).data)

        calendar_details = {
            'id': calendar.id,
            'name': calendar.name,
            'description': calendar.description,
            'start_date': calendar.start_date,
            'end_date': calendar.end_date,
            'contacts': contact_list,
            'meetings': meeting_list
        }
        return JsonResponse(calendar_details, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Calendar not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_contact_to_calendar(request, calendar_id):
    try:
        calendar = Calendar.objects.get(id=calendar_id)
            
        if calendar.owner != request.user:
            return JsonResponse({'error': 'Cannot access another user\'s calendar'}, status=403)
        
        data = request.data
        contact_ids = data.get('contacts')
        if not contact_ids:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        user_contacts = Contact.objects.filter(owner=request.user, id__in=contact_ids)
        if len(user_contacts) != len(contact_ids):

            return JsonResponse({'error': 'One or more contact IDs do not belong to the user\'s contact list'}, status=400)
        
        for id in contact_ids:
            contact = Contact.objects.get(id=id)
            calendar.contacts.add(contact)

        return JsonResponse({"message": "Contacts added successfully"}, status=201)
    except Calendar.DoesNotExist:
        return JsonResponse({'error': 'Calendar not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_contact_availability(request, calendar_id):
    try:
        calendar = Calendar.objects.get(id=calendar_id)
            
        if calendar.owner != request.user:
            return JsonResponse({'error': 'Cannot access another user\'s calendar'}, status=403)
        
        contacts = calendar.contacts.all()
        contact_availabilities = []
        for contact in contacts:
            availabilities = Availability.objects.filter(owner=contact.contact)
            availability_data = []
            for a in availabilities:
                availability_data.append({
                                "start_time": a.start_time,
                                "end_time": a.end_time
                            })
            contact_availabilities.append({
                "contact": {
                    "id": contact.id,
                    "availabilities": availability_data
                }
            })
    
        return JsonResponse({"contact_availabilities": contact_availabilities}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_contact_availability(request, calendar_id):
    try:
        calendar = Calendar.objects.get(id=calendar_id)
            
        if calendar.owner != request.user:
            return JsonResponse({'error': 'Cannot access another user\'s calendar'}, status=403)
        
        contacts = calendar.contacts.all()
        contact_availabilities = []
        for contact in contacts:
            availabilities = Availability.objects.filter(owner=contact.contact)
            availability_data = []
            for a in availabilities:
                availability_data.append({
                                "start_time": a.start_time,
                                "end_time": a.end_time
                            })
            contact_availabilities.append({
                "contact": {
                    "id": contact.id,
                    "availabilities": availability_data
                }
            })
    
        return JsonResponse({"contact_availabilities": contact_availabilities}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_suggested_meeting_times(request, meeting_id):
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
        if meeting.calendar.owner != request.user:
            return JsonResponse({'error': 'Cannot access another user\'s meeting'}, status=403)

        duration = meeting.duration
        start_time = meeting.meeting_time
        deadline = meeting.deadline
        calendar = meeting.calendar
        contacts = calendar.contacts.all()
        availabilities = []

        for contact in contacts:
            avails = Availability.objects.filter(owner=contact.contact)
            avails_list = []
            for a in avails:
                avails_list.append((a.start_time, a.end_time))
            availabilities.append(avails_list)

        current_start_time = start_time
        current_end_time = start_time + duration

        while current_start_time < deadline:

            possible = True
            for a in availabilities:
                possible2 = False
                for start_time, end_time in a:
                    if start_time <= current_start_time or end_time >= current_end_time:
                        possible2 = True
                        break
                if not possible2:
                    possible = False
                    break
            if possible:
                return JsonResponse({"Suggested Time": {"start_time": current_start_time, "end_time": current_end_time}}, status=200)
                        
            current_start_time += duration
            current_end_time += duration

        return JsonResponse({"Suggested Time": "No possible meetings time were found for the availabilities."}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_meeting(request, calendar_id):

    """
    This endpoint is for adding a new meeting to a specific calendar.
    """
    try:
        calendar = Calendar.objects.get(id=calendar_id)
    except Calendar.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = MeetingSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(calendar=calendar)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def meeting_details(request, meeting_id):
    """
    This endpoint is for retrieving the details of a specific meeting.
    """
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
        serializer = MeetingSerializer(meeting)
        return JsonResponse(serializer.data, safe=False)
    except Meeting.DoesNotExist:
        return JsonResponse({'error': 'Meeting not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_meeting(request, meeting_id):
    """
    This endpoint is for editing the details of an existing meeting.
    """
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
    except Meeting.DoesNotExist:
        return JsonResponse({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

    if meeting.calendar.owner != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = MeetingSerializer(meeting, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_final_meeting_time(request, meeting_id):
    """
    This endpoint is for setting the final time for a meeting.
    The view should update the meeting record with the provided meeting_time.
    """
    try:
        meeting = Meeting.objects.get(pk=meeting_id)
    except Meeting.DoesNotExist:
        return JsonResponse({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

    if meeting.calendar.owner != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    meeting_time = request.data.get('meeting_time')
    if not meeting_time:
        return JsonResponse(
            {'error': 'Meeting time is required'},
            status=status.HTTP_400_BAD_REQUEST
            )

    meeting.meeting_time = meeting_time
    meeting.save()
    return JsonResponse({'message': 'Meeting time set successfully'}, status=status.HTTP_200_OK)

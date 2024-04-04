from django.urls import path, include
from . import views


urlpatterns = [
    path('all/', views.get_user_calendars, name='get_user_calendars'),
    path('<int:calendar_id>/details/', views.get_calendar_details, name='get_calendar_details'),
    path('add/', views.add_calendar, name='add_calendar'),
    path('<int:calendar_id>/contacts/add/', views.add_contact_to_calendar),
    path('<int:calendar_id>/contacts/availabilities/', views.get_all_contact_availability),
    path('<int:calendar_id>/meetings/add/', views.add_meeting, name='add_meeting'),
    path(
        'meetings/<int:meeting_id>/details/',
        views.meeting_details,
        name='meeting_details',
        ),
    path(
        'meetings/<int:meeting_id>/edit/',
        views.edit_meeting,
        name='edit_meeting',
        ),
    path(
        'meetings/<int:meeting_id>/setFinalTime/',
        views.set_final_meeting_time, name='set_final_meeting_time',
        ),
    path('meetings/<int:meeting_id>/getSuggestedTimes/', views.get_suggested_meeting_times)
]

from django.db import models
from accounts.models import Contact
from django.contrib.auth.models import User


class Calendar(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=255, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    contacts = models.ManyToManyField(Contact, related_name='calendars')


class Meeting(models.Model):
    calendar = models.ForeignKey(Calendar, related_name='meetings', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.DurationField()
    deadline = models.DateTimeField()
    meeting_time = models.DateTimeField()


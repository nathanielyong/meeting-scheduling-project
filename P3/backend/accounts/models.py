from django.db import models
from django.contrib.auth.models import User


class Contact(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
    contact = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.owner.username} added {self.contact.username}'


class Availability(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availabilities')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()


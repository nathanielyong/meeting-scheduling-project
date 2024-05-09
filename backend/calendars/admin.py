from django.contrib import admin
from .models import *

class CalendarsAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

admin.site.register(Calendar, CalendarsAdmin)
from django.contrib import admin
from .models import *

class ContactsAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

admin.site.register(Contact, ContactsAdmin)
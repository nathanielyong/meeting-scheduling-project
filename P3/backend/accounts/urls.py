from django.contrib import admin
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenBlacklistView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/view/', UserProfileView.as_view()),
    path('profile/edit/', UserProfileEdit.as_view()),
    path('contacts/add/', AddContactView.as_view()),
    path('contacts/delete/', DeleteContactView.as_view()),
    path('contacts/all/', get_contacts),
    path('contacts/search/<str:search_param>/', search_contacts),
    path('logout/', TokenBlacklistView.as_view()),
    path('availabilities/add/', add_availability),
    path('availabilities/all/', get_availabilities)
]

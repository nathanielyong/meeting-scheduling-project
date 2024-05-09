# 1on1

1on1 is a Meeting Scheduling Website created using Django for the backend and React.js for the frontend. This application allows users to login and create new calendars where they can add 
contacts and schedule meetings based on availabilities with them. 

## Backend

Backend was created using Python Django with libraries Django REST Framework, and Simple JWT for authentication. 

Endpoint: /accounts/register/ \
Methods: POST\
Fields/payload: username, password1, password2, email, first_name, last_name\
Description: Registers a user with the provided fields, given that username and email are unique, and password is complex enough.

Endpoint: /accounts/login/ \
Methods: POST\
Fields/payload: username, password\
Description: Logs the user in and provides access and refresh token. Access token expires after 1 hour.

Endpoint: /accounts/logout/\
Methods: POST\
Fields/payload: refresh\
Description: Blacklists the user’s refresh token.

Endpoint: /accounts/profile/view/ \
Methods: GET\
Fields: username, email, first_name, last_name\
Description: Allows a user to view their user information.

Endpoint: /accounts/profile/edit/ \
Methods: PUT\
Fields/payload: first_name, last_name, email, password, password_verify\
Description: Allows a user to edit their user information. password_verify is only required if password is provided.

Endpoint: /accounts/contacts/add/\
Methods: POST\
Fields/payload: username_or_email\
Description: Adds a contact by taking in their username or email, raises validation errors if contact does not exist, is already added, or is the current user.

Endpoint: /accounts/contacts/delete/\
Methods: POST\
Fields/payload: username_or_email\
Description: Deletes a contact by taking in their username or email, raises validation errors if contact does not exist, isn’t added, or is the current user.

Endpoint: /accounts/contacts/all/\
Methods: GET\
Description: Get all of the contacts in the user’s contact list

Endpoint: /accounts/availabilities/add/\
Methods: POST\
Fields/Payload: start_time, end_time\
Description: Create a new availability for the user

Endpoint: /accounts/contacts/search/<str:search_param>/\
Methods: GET\
Description: Returns back a list of contacts that match the search_param provided, matching to username, email, first name, or last name.

Endpoint: /calendars/add/ \
Methods: POST\
Fields/payload: name, description (optional), start_time, end_time\
Description: Add a new calendar 

Endpoint: /calendars/<calendar_id>/details/ \
Methods: GET\
Description: Get description of calendar

Endpoint: /calendars/<calendar_id>/Contacts/add \
Methods: POST\
Fields/payload: contacts: [list of contact ids]\
Description: Add all the contacts to the user’s calendar

Endpoint: /calendars/<calendar_id>/all/ \
Methods: GET\
Fields/payload: \
Description: Get a list of all the user’s calendars

Endpoint: /calendars/<calendar_id>/contacts/availabilities/\
Methods: GET\
Description: Get a list of the contact’s availabilities in the calendar

Endpoint: /calendars/meetings/<int:meeting_id>/getSuggestedTimes\
Methods: GET\
Description: Gets the earliest possible meeting time based on contact availabilities 

Endpoint: /calendars/<calendar_id>/meetings/add/ \
Methods: POST\
Fields/payload: name, description, duration, deadline\
Description: Allows user to add a meeting based on the above fields

Endpoint: /calendars/meetings/<meeting_id>/details/\
Methods: GET\
Fields/payload: name, description, duration, deadline \
Description: Gets detail of meeting ids

Endpoint: /calendars/meetings/<meeting_id>/edit/ \
Methods: POST\
Fields/payload: name, description, duration, deadline\
Description: Allows user to edit meeting details

Endpoint: /calendars/meetings/<meeting_id>/setFinalTime/ \
Methods: POST \
Fields/payload: meeting_time \
Description: Allows user to set final time of meeting 

## Frontend

Frontend was created using React.js with MaterialUI for styling.

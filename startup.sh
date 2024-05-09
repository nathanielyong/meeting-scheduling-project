python -m venv venv
source venv/bin/activate
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
cd backend
python manage.py makemigrations
python manage.py migrate
python -m venv venv
source venv/bin/activate
pip install djangorestframework
pip install djangorestframework-simplejwt
cd OneOnOne
python manage.py makemigrations
python manage.py migrate
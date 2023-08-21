#!/bin/bash


echo "Migrations"
python3 manage.py migrate --no-input

echo "Collect static files"
python3 manage.py collectstatic --no-input

echo "Starting server"
# python3 manage.py runserver 0.0.0.0:8000
gunicorn --config gunicorn-cfg.py core.wsgi

exec "$@"

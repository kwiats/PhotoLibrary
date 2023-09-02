#!/bin/bash

# Collect static files
echo "Collect static files"
python3 manage.py collectstatic --no-input

# Migrations
echo "Migrations"
python3 manage.py migrate --no-input

# Start server
echo "Starting server"
# python3 manage.py runserver 0.0.0.0:8000
gunicorn --config gunicorn-cfg.py core.wsgi

exec "$@"

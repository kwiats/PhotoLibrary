#!/bin/bash

python3 manage.py collectstatic --noinput
ln -s staticfiles backend/static
python3 -m http.server 9000 &
gunicorn --config gunicorn-cfg.py core.wsgi
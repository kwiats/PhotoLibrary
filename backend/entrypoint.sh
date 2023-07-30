#!/bin/bash

python3 manage.py collectstatic --noinput
python3 manage.py task_runner &
ln -s staticfiles backend/static
python3 -m http.server 9000 &
gunicorn --config gunicorn-cfg.py core.wsgi
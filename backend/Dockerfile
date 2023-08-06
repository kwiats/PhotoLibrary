FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY . /code/

RUN python3 -m pip install -r requirements.txt


EXPOSE 8000

RUN ["chmod", "+x", "./entrypoint.sh"]

CMD "./entrypoint.sh"
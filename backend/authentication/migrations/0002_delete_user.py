# Generated by Django 4.1.7 on 2023-07-19 18:51

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(
            name="User",
        ),
    ]
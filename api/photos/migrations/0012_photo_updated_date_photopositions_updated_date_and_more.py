# Generated by Django 4.1.7 on 2023-07-20 11:34

import django.core.validators
from django.db import migrations, models
import photos.models


class Migration(migrations.Migration):
    dependencies = [
        ("photos", "0011_photo_order"),
    ]

    operations = [
        migrations.AddField(
            model_name="photo",
            name="updated_date",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="photopositions",
            name="updated_date",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name="photo",
            name="created_date",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="photo",
            name="photo",
            field=models.ImageField(
                upload_to=photos.models.upload_to,
                validators=[django.core.validators.FileExtensionValidator(["jpg"])],
                verbose_name="photos",
            ),
        ),
        migrations.AlterField(
            model_name="photopositions",
            name="created_date",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]

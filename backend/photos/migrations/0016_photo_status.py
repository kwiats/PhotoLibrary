# Generated by Django 4.1.7 on 2023-08-06 15:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("photos", "0015_alter_photo_photo"),
    ]

    operations = [
        migrations.AddField(
            model_name="photo",
            name="status",
            field=models.CharField(
                choices=[
                    ("NEW", "new"),
                    ("POSITIONED", "positioned at last configuration"),
                    ("NOT POSITIONED", "not positioned"),
                ],
                default="NEW",
                max_length=20,
            ),
        ),
    ]

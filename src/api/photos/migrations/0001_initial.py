# Generated by Django 4.1.7 on 2023-04-02 15:55

from django.db import migrations, models
import photos.models
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Photo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("slug", models.UUIDField(default=uuid.uuid4, editable=False)),
                (
                    "photo",
                    models.ImageField(
                        upload_to=photos.models.upload_to, verbose_name="Photo"
                    ),
                ),
                (
                    "updated",
                    models.DateTimeField(auto_now_add=True, verbose_name="Updated"),
                ),
                ("created", models.DateField(verbose_name="Created")),
            ],
            options={
                "verbose_name": "photo",
                "verbose_name_plural": "Photos",
            },
        ),
    ]

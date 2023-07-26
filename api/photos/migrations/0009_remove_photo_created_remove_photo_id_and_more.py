# Generated by Django 4.1.7 on 2023-07-17 18:20

import uuid

from django.db import migrations, models

import photos.models


class Migration(migrations.Migration):
    dependencies = [
        ("photos", "0008_rename_positions_photopositions_columns"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="photo",
            name="created",
        ),
        migrations.RemoveField(
            model_name="photo",
            name="id",
        ),
        migrations.RemoveField(
            model_name="photo",
            name="slug",
        ),
        migrations.RemoveField(
            model_name="photopositions",
            name="id",
        ),
        migrations.AddField(
            model_name="photo",
            name="created_date",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="photo",
            name="is_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="photo",
            name="uuid",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
        migrations.AddField(
            model_name="photopositions",
            name="created_date",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="photopositions",
            name="is_deleted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="photopositions",
            name="uuid",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
        migrations.AlterField(
            model_name="photo",
            name="photo",
            field=models.ImageField(
                upload_to=photos.models.upload_to, verbose_name="photos"
            ),
        ),
        migrations.AlterField(
            model_name="photopositions",
            name="columns",
            field=models.JSONField(null=True),
        ),
    ]
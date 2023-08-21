from uuid import uuid4

from django.db import models


class BaseModel(models.Model):
    uuid: models.UUIDField = models.UUIDField(
        primary_key=True, default=uuid4, editable=False
    )
    created_date: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_date: models.DateTimeField = models.DateTimeField(auto_now=True)
    is_deleted: models.BooleanField = models.BooleanField(default=False)

    class Meta:
        abstract = True

from django.db import models
from uuid import uuid4


class BaseModel(models.Model):
    uuid = models.UUIDField(
        primary_key=True,
        default=uuid4,
        editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True
from django.db import models

from core.models import BaseModel


# Create your models here.
class HistoryModel(BaseModel):
    uuid_object = models.UUIDField(verbose_name="ID of object")
    previous_state = models.JSONField(verbose_name='Previous state')
    current_state = models.JSONField(verbose_name='Current state')

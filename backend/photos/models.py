from django.core.validators import FileExtensionValidator
from django.db import models

from core.models import BaseModel

NEW = "NEW"
POSITIONED = "POSITIONED"
UNPOSITIONED = "NOT POSITIONED"


def upload_to(instance, filename):
    return "assets/images/{filename}".format(filename=filename)


class PhotoPositions(BaseModel):
    columns = models.JSONField(null=True)


class Photo(BaseModel):
    STATUS_PHOTO = [
        (NEW, "new"),
        (POSITIONED, "positioned at last configuration"),
        (UNPOSITIONED, "not positioned"),
    ]
    photo = models.ImageField(
        upload_to=upload_to,
        max_length=100,
        verbose_name="photos",
        validators=[FileExtensionValidator(["jpg", "jpeg"])],
    )
    column_id = models.IntegerField(default=1)
    order = models.IntegerField(default=0)
    status = models.CharField(choices=STATUS_PHOTO, max_length=20, default=NEW)

    def __str__(self):
        return f"{self.uuid} - {self.photo}"

    class Meta:
        verbose_name = "photo"
        verbose_name_plural = "Photos"

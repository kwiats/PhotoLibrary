from django.core.validators import FileExtensionValidator
from django.db import models

from core.models import BaseModel
from photos.utils.photo_utils import CustomFileSystemStorage


class PhotoPositions(BaseModel):
    columns = models.JSONField(null=True)


def upload_to(instance, filename):
    return "assets/images/{filename}".format(filename=filename)


custom_storage = CustomFileSystemStorage()


class Photo(BaseModel):
    photo = models.ImageField(
        upload_to=upload_to,
        max_length=100,
        verbose_name="photos",
        validators=[FileExtensionValidator(["jpg", "jpeg"])],
        storage=custom_storage,
    )
    column_id = models.IntegerField(default=1)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.uuid} - {self.photo}"

    class Meta:
        verbose_name = "photo"
        verbose_name_plural = "Photos"

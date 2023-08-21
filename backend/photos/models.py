from django.core.validators import FileExtensionValidator
from django.db import models

from core.models import BaseModel

NEW = "NEW"
POSITIONED = "POSITIONED"
UNPOSITIONED = "NOT POSITIONED"

ONE_COLUMN = "ONE_COLUMN"
TWO_COLUMNS = "TWO_COLUMNS"
THREE_COLUMNS = "THREE_COLUMNS"

FULL_WEIGHT = "FULL_WEIGHT"
FULL_HEIGHT = "FULL_HEIGHT"

LEFT = "LEFT"
CENTER = "CENTER"
RIGHT = "RIGHT"


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
    STYLE_COLUMN = [
        (ONE_COLUMN, "one_column"),
        (TWO_COLUMNS, "two_columns"),
        (THREE_COLUMNS, "three_columns"),
    ]
    STYLE_SIZE = [
        (FULL_HEIGHT, "full_height"),
        (FULL_WEIGHT, "full_weight"),
    ]

    STYLE_SIDE = [
        (LEFT, "left"),
        (CENTER, "center"),
        (RIGHT, "right"),
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
    style_column = models.CharField(
        choices=STYLE_COLUMN, max_length=20, default=ONE_COLUMN
    )
    style_size = models.CharField(
        choices=STYLE_SIZE, max_length=20, default=FULL_HEIGHT
    )
    style_side = models.CharField(choices=STYLE_SIDE, max_length=20, default=LEFT)

    def __str__(self):
        return f"{self.uuid} - {self.photo}"

    class Meta:
        verbose_name = "photo"
        verbose_name_plural = "Photos"

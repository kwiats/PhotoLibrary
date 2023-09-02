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
        (ONE_COLUMN, "one column"),
        (TWO_COLUMNS, "two columns"),
        (THREE_COLUMNS, "three columns"),
    ]
    STYLE_SIZE = [
        (FULL_HEIGHT, "full height"),
        (FULL_WEIGHT, "full weight"),
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


class FileRow(BaseModel):
    class StyleColumnChoices(models.IntegerChoices):
        ONE_COLUMN = 0, "one column"
        TWO_COLUMNS = 1, "two columns"
        THREE_COLUMNS = 2, "three columns"

    order = models.PositiveIntegerField(null=True, blank=True, unique=True)
    style_column = models.PositiveIntegerField(
        choices=StyleColumnChoices.choices, default=StyleColumnChoices.ONE_COLUMN
    )

    @property
    def class_name(self):
        return f"row_{self.order}"

    def save(self, *args, **kwargs):
        if self._state.adding:  # Only set the order for new instances
            last_instance = FileRow.objects.order_by("-order").first()
            if last_instance:
                self.order = last_instance.order + 1
            else:
                self.order = 1
        super().save(*args, **kwargs)


class FileElement(BaseModel):
    class StyleSizeChoices(models.IntegerChoices):
        FULL_HEIGHT = 0, "full height"
        FULL_WIDTH = 1, "full width"

    class StyleSideChoices(models.IntegerChoices):
        LEFT = 0, "left"
        CENTER = 1, "center"
        RIGHT = 2, "right"

    class StatusPhotoChoices(models.TextChoices):
        NEW = "new", "new"
        POSITIONED = "positioned", "positioned at last configuration"
        UNPOSITIONED = "unpositioned", "not positioned"

    file = models.FileField(
        upload_to=upload_to, max_length=100, verbose_name="file", null=True, blank=True
    )
    status = models.CharField(
        choices=StatusPhotoChoices.choices,
        max_length=20,
        default=StatusPhotoChoices.NEW,
    )
    row = models.ForeignKey(FileRow, on_delete=models.SET_NULL, null=True, blank=True)
    style_size = models.IntegerField(
        choices=StyleSizeChoices.choices, default=StyleSizeChoices.FULL_HEIGHT
    )
    style_side = models.IntegerField(
        choices=StyleSideChoices.choices, default=StyleSideChoices.LEFT
    )

    @property
    def order(self):
        return self.row.order if self.row else None

    def save(self, *args, **kwargs):
        if self.row:
            self.status = self.StatusPhotoChoices.POSITIONED
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "file"
        verbose_name_plural = "Files"

import uuid
from django.db import models


def upload_to(instance, filename):
    return "assets/images/{filename}".format(filename=filename)


class Photo(models.Model):
    slug = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
    )
    photo = models.ImageField(("Photo"), upload_to=upload_to, max_length=100)
    updated = models.DateTimeField(
        ("Updated"),
        auto_now=False,
        auto_now_add=True,
    )
    created = models.DateField(("Created"), auto_now=False, auto_now_add=False)

    def __str__(self):
        return f"{self.slug}"

    class Meta:
        verbose_name = "photo"
        verbose_name_plural = "Photos"

import uuid
from typing import Union

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from photos.models import Photo


class PhotoInterface:
    @staticmethod
    def get() -> Union[list[Photo], None]:
        photo = Photo.objects.filter(is_deleted=False).all()
        if photo is not None:
            return photo
        return None

    @staticmethod
    def create(*, photo_name, photo_file) -> Photo:
        with transaction.atomic():
            image = Photo()
            image.photo.save(photo_name, photo_file, save=False)
            image.full_clean()
            image.save()
            return image

    @staticmethod
    def update(*, photo_id: uuid.UUID, column_id, order_id, status: str = None):
        with transaction.atomic():
            photo = Photo.objects.get(uuid=photo_id)
            photo.column_id = column_id
            photo.order = order_id
            photo.status = status
            photo.save()

    @staticmethod
    def delete(*, photo_id: Union[uuid.UUID, str]):
        with transaction.atomic():
            try:
                photo = Photo.objects.get(uuid=photo_id)
                photo.delete()
            except ObjectDoesNotExist:
                pass

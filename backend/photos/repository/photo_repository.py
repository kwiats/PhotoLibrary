import uuid
from itertools import groupby
from operator import attrgetter
from typing import Union

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from photos.models import Photo, POSITIONED


class PhotoRepository:
    @staticmethod
    def get_rows() -> Union[list[list[Photo]], None]:
        queryset = Photo.objects.filter(is_deleted=False).all()
        queryset = queryset.filter(status=POSITIONED)
        if not queryset:
            return None

        sorted_queryset = sorted(queryset, key=attrgetter("order"))
        rows = []
        for order, photos_in_row in groupby(sorted_queryset, key=attrgetter("order")):
            row_with_photos = list(photos_in_row)
            rows.append(row_with_photos)

        return rows

    @staticmethod
    def get_columns() -> Union[list[list[Photo]], None]:
        queryset = Photo.objects.filter(is_deleted=False).all()
        queryset = queryset.filter(status=POSITIONED)
        if not queryset:
            return None

        sorted_queryset = sorted(queryset, key=attrgetter("order"))
        columns = []
        for order, photos_in_column in groupby(
            sorted_queryset, key=attrgetter("column_id")
        ):
            columns_with_photos = list(photos_in_column)
            columns.append(columns_with_photos)

        return columns

    @staticmethod
    def get() -> Union[list[Photo], None]:
        queryset = Photo.objects.filter(is_deleted=False).all()
        queryset = queryset.filter(status=POSITIONED)
        sorted_queryset = sorted(queryset, key=attrgetter("order"))
        if sorted_queryset is not None:
            return sorted_queryset

        return None

    @staticmethod
    def get_all() -> Union[list[Photo], None]:
        queryset = Photo.objects.filter(is_deleted=False).all()
        sorted_queryset = sorted(queryset, key=attrgetter("order"))
        if sorted_queryset is not None:
            return sorted_queryset

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
    def update(*, photo_id: uuid.UUID, column_id, order_id, status: str = None) -> None:
        with transaction.atomic():
            photo = Photo.objects.get(uuid=photo_id)
            photo.column_id = column_id
            photo.order = order_id
            photo.status = status
            photo.save()

    @staticmethod
    def delete(*, photo_id: Union[uuid.UUID, str]) -> None:
        with transaction.atomic():
            try:
                photo = Photo.objects.get(uuid=photo_id)
                photo.delete()
            except ObjectDoesNotExist:
                pass

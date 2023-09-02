from typing import Union

from django.db import transaction

from photos.models import FileRow, FileElement


class FileRepository:
    @staticmethod
    def get_rows() -> Union[list[list[FileRow]], None]:
        queryset = FileRow.objects.filter(is_deleted=False)
        if queryset.exists():
            return queryset

    @staticmethod
    def create(*, file_name: str, file) -> FileElement:
        with transaction.atomic():
            image = FileElement()
            image.file.save(file_name, file, save=False)
            image.full_clean()
            image.save()
            return image

import uuid
from typing import Union, List

from django.db import transaction

from photos.models import FileRow, FileElement


class FileRepository:
    @staticmethod
    def get_rows() -> Union[List[List[FileRow]], None]:
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

    @staticmethod
    def update(
        *,
        file_uuid: uuid.UUID,
        row: FileRow = None,
        status: str = "new",
        style_size: int = 0,
        style_side: int = 0
    ) -> None:
        with transaction.atomic():
            photo = FileElement.objects.get(uuid=file_uuid)
            photo.row = row
            photo.style_size = style_size
            photo.style_side = style_side
            photo.status = status
            photo.save()

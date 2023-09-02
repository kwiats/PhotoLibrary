from typing import Union

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from photos.models import FileElement, FileRow
from photos.repository.file_repository import FileRepository
from photos.schemas.file_schemas import FileRowEntry, FileElementEntry
from photos.serializers import FileElementSerializer
from photos.utils.photo_utils import (
    _convert_object_to_worst_quality,
    _generator_photo_name,
)


class FileService:
    @staticmethod
    def get_file_rows():
        return FileRepository.get_rows()

    @staticmethod
    def create_file_rows():
        pass

    @staticmethod
    def update_rows(
        *, row: Union[FileRow], files: Union[list[FileElementEntry]]
    ) -> FileRow:
        for element in files:
            if element.uuid and element.file:
                object_file = FileElement.objects.get(uuid=element.uuid)
                object_file.status = FileElement.StatusPhotoChoices.POSITIONED
                object_file.row = row
                object_file.style_size = element.styleSize
                object_file.style_side = element.styleSide
                object_file.save()
        return row

    @staticmethod
    def update_details_row(
        *, row: Union[FileRow], new_row: Union[FileRowEntry]
    ) -> FileRow:
        row.style_column = new_row.styleColumn
        row.save()
        return row

    @staticmethod
    def parse_to_entry(*, data: dict) -> FileRowEntry:
        files_data = data.pop("files")
        files = [FileElementEntry(**file_data) for file_data in files_data]
        row_entry = FileRowEntry(files=files, **data)
        return row_entry

    @staticmethod
    def create_photo(files):
        result = []
        for file in files:
            file = _convert_object_to_worst_quality(file, quality=99, format="JPEG")
            name = _generator_photo_name("jpg")

            obj = FileRepository.create(file_name=name, file=file)

            if obj is None:
                message = f"Cannot upload this photo"
                return Response({"error": message}, status=status.HTTP_404_NOT_FOUND)

            result.append(obj)

        return FileElementSerializer(result, many=True).data

    @staticmethod
    def unposition_files():
        unpositioned_order = 0
        files = FileElement.objects.all()
        for file in files:
            try:
                if file.status != FileElement.StatusPhotoChoices.NEW:
                    FileRepository.update(
                        file_uuid=file.uuid,
                        status=FileElement.StatusPhotoChoices.UNPOSITIONED,
                    )
                    unpositioned_order += 1
            except ObjectDoesNotExist:
                pass

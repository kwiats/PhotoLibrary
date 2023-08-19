import json

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from photos.models import PhotoPositions, Photo, POSITIONED, UNPOSITIONED, NEW
from photos.repository.photo_repository import PhotoRepository
from photos.serializers import PhotoSerializer
from photos.utils.photo_utils import (
    _convert_object_to_worst_quality,
    _generator_photo_name,
)


def clean_positions(photo: str) -> None:
    all_positions = PhotoPositions.objects.all()

    for position in all_positions:
        columns = position.columns
        target_element = None
        target_column_id = None
        for column in columns:
            data = json.loads(columns[str(column)])
            for element in data:
                if element["uuid"] == photo:
                    target_element = element

                    target_column_id = str(column)

        if target_element is not None and target_column_id is not None:
            target_element_order = target_element["order"]
            column = json.loads(columns[target_column_id])
            column.remove(target_element)

            for element in column:
                if element["order"] > target_element_order:
                    if element["order"] - 1 != 0:
                        element["order"] -= 1

            position.columns[target_column_id] = json.dumps(column)
            position.save()


class PhotoService:
    @staticmethod
    def get_photos():
        return PhotoRepository.get()

    @staticmethod
    def get_all_photos():
        return PhotoRepository.get_all()

    @staticmethod
    def get_rows():
        return PhotoRepository.get_rows()

    @staticmethod
    def get_columns():
        return PhotoRepository.get_columns()

    @staticmethod
    def create_photo(files):
        result = []
        for file in files:
            file = _convert_object_to_worst_quality(file, quality=70)
            name = _generator_photo_name()

            image = PhotoRepository.create(photo_name=name, photo_file=file)

            if image is None:
                message = f"Cannot upload this photo"
                return Response({"error": message}, status=status.HTTP_404_NOT_FOUND)

            result.append(image)

        return PhotoSerializer(result, many=True).data

    @staticmethod
    def update_photo(*, columns: dict) -> None:
        PhotoService.unposition_photos()
        columns_photos = set()

        for column_id, data in columns.items():
            loaded_data = json.loads(data)
            for order, photo in enumerate(loaded_data):
                try:
                    photo_id = photo["uuid"]
                    columns_photos.add(photo_id)
                    PhotoRepository.update(
                        photo_id=photo_id,
                        column_id=column_id,
                        order_id=order,
                        status=POSITIONED,
                    )
                except ObjectDoesNotExist:
                    pass

    @staticmethod
    def unposition_photos():
        unpositioned_order = 0
        all_photos = Photo.objects.all()
        for photo in all_photos:
            try:
                if photo.status != NEW:
                    PhotoRepository.update(
                        photo_id=photo.uuid,
                        column_id=0,
                        order_id=unpositioned_order,
                        status=UNPOSITIONED,
                    )
                    unpositioned_order += 1
            except ObjectDoesNotExist:
                pass

    @staticmethod
    def delete_photo(*, photo_id: str) -> Response:
        try:
            clean_positions(photo_id)
            PhotoRepository.delete(photo_id=photo_id)
        except ObjectDoesNotExist:
            pass
        except Photo.DoesNotExist:
            return Response(
                {"message": "Photo not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {"message": "Invalid photo_id format"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": "Photo deleted successfully"}, status=status.HTTP_200_OK
        )

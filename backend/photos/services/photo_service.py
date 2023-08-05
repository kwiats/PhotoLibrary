import json

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from photos.interfaces.photo_interface import PhotoInterface
from photos.models import PhotoPositions
from photos.serializers import PhotoSerializer
from photos.utils.photo_utils import (
    _convert_object_to_worst_quality,
    _generator_photo_name,
)


class PhotoService:
    @staticmethod
    def get_photos():
        return PhotoInterface.get()

    @staticmethod
    def create_photo(files):
        result = []
        for file in files:
            file = _convert_object_to_worst_quality(file, quality=70)
            name = _generator_photo_name()

            image = PhotoInterface.create(photo_name=name, photo_file=file)

            if image is None:
                message = f"Cannot upload this photo"
                return Response({"error": message}, status=status.HTTP_404_NOT_FOUND)

            result.append(image)

        return PhotoSerializer(result, many=True).data

    @staticmethod
    def update_photo(*, columns: dict) -> None:
        for column_id, data in columns.items():
            loaded_data = json.loads(data)
            for order, photo in enumerate(loaded_data):
                try:
                    photo_id = photo["uuid"]
                    PhotoInterface.update(
                        photo_id=photo_id, column_id=column_id, order_id=order
                    )
                except ObjectDoesNotExist:
                    pass

    @staticmethod
    def delete_photo(id: str) -> None:
        latest_configuration = PhotoPositions.objects.order_by("-created_date")
        latest_configuration = latest_configuration.first()
        loaded_data = json.loads(latest_configuration)
        print(loaded_data)
        # try:
        #     photo_id = uuid.UUID(id)
        #     PhotoInterface.delete(photo_id=photo_id)
        # except ObjectDoesNotExist:
        #     pass

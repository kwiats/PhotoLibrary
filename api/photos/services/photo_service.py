import json

from django.core.exceptions import ObjectDoesNotExist

from photos.interfaces.photo_interface import PhotoInterface
from photos.serializers import PhotoSerializer
from photos.utils.photo_utils import _convert_object_to_worst_quality, _generator_photo_name


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

            result.append(image)

        return PhotoSerializer(result, many=True).data

    @staticmethod
    def update_photo(*, columns: dict) -> None:
        for column_id, data in columns.items():
            loaded_data = json.loads(data)
            for order, photo in enumerate(loaded_data):
                try:
                    photo_id = photo['uuid']
                    PhotoInterface.update(photo_id=photo_id,
                                          column_id=column_id,
                                          order_id=order)
                except ObjectDoesNotExist:
                    pass

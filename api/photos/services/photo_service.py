import uuid
from io import BytesIO
from typing import Type

from PIL import Image

from photos.interfaces.photo_interface import PhotoInterface
from photos.models import Photo
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

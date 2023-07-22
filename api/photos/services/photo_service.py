import uuid
from io import BytesIO

from PIL import Image

from photos.models import Photo
from photos.serializers import PhotoSerializer


class PhotoService:
    def __init__(self):
        pass

    def _convert_object_to_worst_quality(self, file, quality: int = 70):
        photo = Image.open(BytesIO(file.read()))

        photo = photo.convert('RGB')

        buffer = BytesIO()
        photo.save(buffer, format='JPEG', quality=quality)
        buffer.seek(0)
        return buffer

    def _generator_name(self):
        return str(uuid.uuid4()) + '.jpg'

    def get_photos(self):
        return Photo.objects.filter(is_deleted=False).all()

    def create_photo(self, files):
        result =[]
        for file in files:
            converted_file = self._convert_object_to_worst_quality(file, quality=70)
            image = Photo()
            image.photo.save(self._generator_name(), converted_file, save=False )

            image.full_clean()
            image.save()
            result.append(image)

        return PhotoSerializer(result,many=True).data


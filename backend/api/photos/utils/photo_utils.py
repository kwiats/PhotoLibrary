import uuid
from io import BytesIO

from PIL import Image


def _convert_object_to_worst_quality(file, quality: int = 70):
    photo = Image.open(BytesIO(file.read()))

    photo = photo.convert('RGB')

    buffer = BytesIO()
    photo.save(buffer, format='JPEG', quality=quality)
    buffer.seek(0)
    return buffer


def _generator_photo_name():
    return str(uuid.uuid4()) + '.jpg'

import os
import uuid
from io import BytesIO

from PIL import Image
from django.core.exceptions import SuspiciousFileOperation
from django.core.files.storage import FileSystemStorage


def _convert_object_to_worst_quality(file, quality: int = 70, format: str = "JPEG"):
    photo = Image.open(BytesIO(file.read()))

    photo = photo.convert("RGB")

    buffer = BytesIO()
    photo.save(buffer, format=format, quality=quality)
    buffer.seek(0)
    return buffer


def _generator_photo_name(format: str = "jpg"):
    return "{}.{}".format(uuid.uuid4(), format)


class CustomFileSystemStorage(FileSystemStorage):
    def delete(self, name):
        if name:
            try:
                path = self.path(name)

                if os.path.exists(path):
                    os.remove(path)
                else:
                    raise FileNotFoundError(f"File not found at path: {path}")
            except (PermissionError, FileNotFoundError) as e:
                raise SuspiciousFileOperation(f"Failed to delete file: {e}")

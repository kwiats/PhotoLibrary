import pytest

from photos.models import Photo


@pytest.mark.django_db
def test_photo_model_create():
    photo = Photo.objects.create()
    assert isinstance(photo, Photo), "Should create a Photo instance"

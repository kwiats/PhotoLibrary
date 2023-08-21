import datetime

import pytest
from django.db.models.fields.files import ImageFieldFile

from photos.models import Photo
from photos.tests.factory import PhotoFactory


@pytest.mark.django_db
class TestPhoto:
    @pytest.fixture
    def photo(self):
        return PhotoFactory.create()

    def test_instance_photo(self, photo):
        assert isinstance(photo, Photo)
        assert isinstance(photo.uuid, str)
        assert isinstance(photo.photo, ImageFieldFile)
        assert isinstance(photo.column_id, int)
        assert isinstance(photo.status, list)
        assert isinstance(photo.order, int)
        assert isinstance(photo.created_date, datetime.datetime)

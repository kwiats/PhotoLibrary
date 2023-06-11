from rest_framework import serializers
from photos.models import Photo


class PhotoSerializers(serializers.ModelSerializer):
    photo = serializers.ImageField(required=True)

    class Meta:
        model = Photo
        fields = ["id", "slug", "photo", "created", "updated"]

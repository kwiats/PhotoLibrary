from rest_framework import serializers

from photos.models import Photo, PhotoPositions


class PhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=True)

    class Meta:
        model = Photo
        ordering = ["-created_date", "order", "column_id"]
        fields = [
            "uuid",
            "photo",
            "created_date",
            "column_id",
            "order",
            "status",
            "style_column",
            "style_size",
            "style_side",
        ]


class PhotoPositionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoPositions
        ordering = ["-created_date"]
        fields = ["uuid", "columns", "created_date"]

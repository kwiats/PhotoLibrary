from rest_framework import serializers

from photos.models import Photo, PhotoPositions, FileElement, FileRow


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


class FileElementSerializer(serializers.ModelSerializer):
    styleSide = serializers.IntegerField(source="style_side", required=False)
    styleSize = serializers.IntegerField(source="style_size", required=False)

    class Meta:
        model = FileElement
        ordering = ["-created_date", "order"]
        fields = ["uuid", "file", "status", "styleSize", "styleSide", "order"]


class FileRowSerializer(serializers.ModelSerializer):
    styleColumn = serializers.IntegerField(source="style_column", required=True)
    className = serializers.CharField(source="class_name")
    files = FileElementSerializer(many=True, source="fileelement_set")

    class Meta:
        model = FileRow
        ordering = ["order", "-created_date"]
        fields = ["files", "uuid", "order", "className", "files", "styleColumn"]

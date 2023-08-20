from django.contrib import admin

from photos.models import Photo, PhotoPositions


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["uuid", "status", "photo", "created_date", "column_id", "order"]


@admin.register(PhotoPositions)
class PhotoPositionsAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["uuid", "created_date"]

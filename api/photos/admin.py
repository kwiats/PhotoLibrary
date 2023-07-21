from django.contrib import admin

from photos.models import Photo, PhotoPositions


class PhotoAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["photo", "created_date", "column_id", "order"]


class PhotoPositionsAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["uuid", "created_date"]


# Register your models here.
admin.site.register(Photo, PhotoAdmin)
admin.site.register(PhotoPositions, PhotoPositionsAdmin)

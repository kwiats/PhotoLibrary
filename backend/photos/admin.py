from django.contrib import admin

from photos.models import Photo, PhotoPositions, FileElement, FileRow


class PhotoAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = [
        "uuid",
        "status",
        "photo",
        "created_date",
        "column_id",
        "order",
        "style_column",
        "style_size",
        "style_side",
    ]


class PhotoPositionsAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["uuid", "created_date"]


class FileElementInline(admin.TabularInline):
    model = FileElement
    extra = 0


class FileRowAdmin(admin.ModelAdmin):
    list_display = ("order", "style_column", "class_name", "file_elements_count")
    list_editable = ("style_column",)
    ordering = ("order",)
    inlines = [FileElementInline]

    def file_elements_count(self, obj):
        return obj.fileelement_set.count()

    file_elements_count.short_description = "File Elements Count"


class FileElementAdmin(admin.ModelAdmin):
    list_display = ("uuid", "file", "status", "row", "style_size", "style_side")
    list_filter = ("status", "row", "style_size", "style_side")
    list_editable = ("status",)
    search_fields = ("file",)


admin.site.register(FileRow, FileRowAdmin)
admin.site.register(FileElement, FileElementAdmin)


admin.site.register(Photo, PhotoAdmin)
admin.site.register(PhotoPositions, PhotoPositionsAdmin)

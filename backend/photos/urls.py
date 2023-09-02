from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from photos.views import (
    PhotoView,
    PhotoPositionViews,
    delete_photo,
    get_rows_photo,
    get_columns_photo,
    FileViewSet,
    FileElementsViewSet,
    FileRowsViews,
    FileElementView,
)

urlpatterns = [
    path("", PhotoView.as_view(), name="photos-api"),
    path("file", FileElementView.as_view(), name="photos-api"),
    path("files", FileViewSet.as_view({"get": "list"})),
    path("all-files", FileElementsViewSet.as_view({"get": "list"})),
    path("rows", get_rows_photo, name="photos-rows"),
    path("columns", get_columns_photo, name="photos-columns"),
    path("delete/<str:pk>/", delete_photo, name="delete-photo"),
    path("positions", PhotoPositionViews.as_view(), name="configuration_photos"),
    path("file-rows", FileRowsViews.as_view(), name="save-file-rows"),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

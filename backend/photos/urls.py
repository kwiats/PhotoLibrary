from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from photos.views import (
    PhotoView,
    PhotoPositionViews,
    delete_photo,
    get_rows_photo,
    get_columns_photo,
)

urlpatterns = [
    path("", PhotoView.as_view(), name="photos-api"),
    path("rows", get_rows_photo, name="photos-rows"),
    path("columns", get_columns_photo, name="photos-columns"),
    path("delete/<str:pk>/", delete_photo, name="delete-photo"),
    path("positions", PhotoPositionViews.as_view(), name="configuration_photos"),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

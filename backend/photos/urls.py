from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from photos.views import PhotoView, PhotoPositionViews, delete_photo

urlpatterns = [
    path("", PhotoView.as_view(), name="photos-api"),
    path("delete/<str:pk>/", delete_photo, name="delete-photo"),
    path("positions", PhotoPositionViews.as_view(), name="configuration_photos"),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

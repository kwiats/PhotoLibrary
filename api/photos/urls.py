from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from photos.views import PhotoView, PhotoPositionViews

urlpatterns = [
    path("", PhotoView.as_view(), name="photos-api"),
    path("positions", PhotoPositionViews.as_view(), name="configuration_photos"),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

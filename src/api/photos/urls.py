from photos.views import (
    PhotoCreateView,
    PhotoDeleteView,
    PhotoListView,
    PhotoUpdateView,
)
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("add", PhotoCreateView.as_view(), name="add-photo"),
    path("list", PhotoListView.as_view(), name="list-photo"),
    path("delete/<slug:slug>", PhotoDeleteView.as_view(), name="delete-photo"),
    path("update/<slug:slug>", PhotoUpdateView.as_view(), name="update-photo"),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

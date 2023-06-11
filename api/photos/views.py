from rest_framework import viewsets
from photos.models import Photo
from photos.serializers import PhotoSerializers
from django.views.generic import CreateView, ListView, DeleteView, UpdateView


class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializers
    queryset = Photo.objects.all()


class PhotoCreateView(CreateView):
    model = Photo
    fields = "__all__"


class PhotoListView(ListView):
    model = Photo
    template_name = "index.html"


class PhotoDeleteView(DeleteView):
    model = Photo
    template_name = "index.html"


class PhotoUpdateView(UpdateView):
    model = Photo
    template_name = "index.html"

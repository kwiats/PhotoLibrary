import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from photos.models import Photo, PhotoPositions
from photos.serializers import PhotoSerializer, PhotoPositionsSerializer
from photos.services.photo_service import PhotoService


class PositionsViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoPositionsSerializer
    queryset = PhotoPositions.objects.all()


class PhotoView(APIView):
    def get(self, request):
        photos = PhotoService.get_photos()

        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('file')
        message = ''

        PhotoService.create_photo(files)

        return Response({'message': message})


class PhotoPositionViews(APIView):
    def get(self, request):
        latest_configuration = PhotoPositions.objects.order_by('-created_date')
        latest_configuration = latest_configuration.first()

        if latest_configuration is None:
            return JsonResponse({'message': 'No configurations found.'}, status=404)

        columns = latest_configuration.columns

        return JsonResponse({'columns': columns})

    def post(self, request):
        columns = {
            '1': request.data.get('1'),
            '2': request.data.get('2'),
            '3': request.data.get('3')
        }

        for column_id, data in columns.items():
            loaded_data = json.loads(data)
            for i, photo in enumerate(loaded_data):
                try:
                    photo = Photo.objects.get(uuid=photo['uuid'])
                    photo.column_id = column_id
                    photo.order = i
                    photo.save()
                except ObjectDoesNotExist:
                    pass

        configuration_photos = PhotoPositions.objects.create(columns=columns)

        return JsonResponse({'message': 'Configuration saved successfully.'})

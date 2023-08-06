from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from photos.models import PhotoPositions, Photo
from photos.serializers import PhotoSerializer, PhotoPositionsSerializer
from photos.services.photo_service import PhotoService


class PositionsViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoPositionsSerializer
    queryset = PhotoPositions.objects.all()


class PhotoView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        photos = PhotoService.get_photos()
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("file")
        if files is None:
            return Response(
                {"message": "No photos is uploaded "}, status=status.HTTP_404_NOT_FOUND
            )

        message = f"Uploaded {len(files)} files to server"
        created = PhotoService.create_photo(files)
        if created:
            return Response({"message": message}, status=status.HTTP_200_OK)
        return Response(
            {"message": "We cannot add this photos"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


@api_view(["DELETE"])
def delete_photo(request, pk: str):
    if request.method == "DELETE":
        photo = Photo.objects.get(uuid=pk)
        print(photo)
        response = PhotoService.delete_photo(photo_id=pk)
        return response


class PhotoPositionViews(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        latest_configuration = PhotoPositions.objects.order_by("-created_date")
        latest_configuration = latest_configuration.first()

        if latest_configuration is None:
            return Response({"message": "No configurations found."}, status=404)

        columns = latest_configuration.columns

        return JsonResponse({"columns": columns})

    def post(self, request):
        columns = {
            "1": request.data.get("1"),
            "2": request.data.get("2"),
            "3": request.data.get("3"),
        }

        PhotoService.update_photo(columns=columns)

        PhotoPositions.objects.create(columns=columns)

        return Response(
            {"message": "Configuration saved successfully."}, status=status.HTTP_200_OK
        )

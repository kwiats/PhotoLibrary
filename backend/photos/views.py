from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from photos.models import PhotoPositions
from photos.serializers import PhotoSerializer, PhotoPositionsSerializer
from photos.services.photo_service import PhotoService


class PositionsViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoPositionsSerializer
    queryset = PhotoPositions.objects.all()


class CustomPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "pageSize"
    max_page_size = 100

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)

        response.data["results"] = list(data)
        response.data["count"] = self.page.paginator.count
        response.data["pages"] = self.page.paginator.num_pages

        return response


class PhotoView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        photos = PhotoService.get_photos()

        paginator = CustomPagination()
        paginated_photos = paginator.paginate_queryset(photos, request)

        serializer = PhotoSerializer(paginated_photos, many=True)
        response = paginator.get_paginated_response(serializer.data)
        return response

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("file")
        if files is None:
            return Response(
                {"message": "No photos is uploaded "}, status=status.HTTP_404_NOT_FOUND
            )
        created = PhotoService.create_photo(files)
        if created:
            return Response(
                {"message": f"Uploaded {len(files)} files to server"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "We cannot add this photos"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_rows_photo(request):
    serialized_rows = []
    rows = PhotoService.get_rows()
    if not rows:
        return Response(
            {"message": "Photos are not positioned"},
            status=status.HTTP_404_NOT_FOUND,
        )
    for photos in rows:
        serializer = PhotoSerializer(photos, many=True)
        serialized_rows.append(serializer.data)
    return Response(serialized_rows)


@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_columns_photo(request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    serialized_columns = []
    columns = PhotoService.get_columns()
    if not columns:
        return Response(
            {"message": "Photos are not positioned"},
            status=status.HTTP_404_NOT_FOUND,
        )
    result_page = paginator.paginate_queryset(columns, request)
    for photos in result_page:
        serializer = PhotoSerializer(photos, many=True)
        serialized_columns.append(serializer.data)
    return paginator.get_paginated_response(serialized_columns)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_photo(request, pk: str):
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

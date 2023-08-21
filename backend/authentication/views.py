from rest_framework_simplejwt.views import TokenObtainPairView

from authentication.serializers import TokenSerializer


class TokenViews(TokenObtainPairView):
    def get_serializer_class(self):
        return TokenSerializer

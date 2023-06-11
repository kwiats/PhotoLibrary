from rest_framework_simplejwt.views import TokenObtainPairView

from authentication.serializers import TokenSerializer


# Create your views here.

class TokenViews(TokenObtainPairView):
    def get_serializer_class(self):
        return TokenSerializer

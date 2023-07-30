import http

import jwt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login

from authentication.serializers import TokenSerializer


class TokenViews(TokenObtainPairView):
    def get_serializer_class(self):
        return TokenSerializer

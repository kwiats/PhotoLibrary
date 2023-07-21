import http

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login

from authentication.serializers import TokenSerializer


class TokenViews(TokenObtainPairView):
    def get_serializer_class(self):
        return TokenSerializer


class AuthenticationView(APIView):
    def post(self, request):
        message = None

        username = request.data.get('username')
        password = request.data.get('password')
        if username and password:
            user = authenticate(username=username, password=password)

            if user is not None and user.is_superuser:
                login(request, user)
                message = f'Welcome, {username}'
            else:
                message = 'Invalid credentials'
        else:
            message = 'Please provide your username and password'

        return Response({"message": message})

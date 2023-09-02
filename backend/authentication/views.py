from django.conf import settings
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from authentication.serializers import TokenSerializer


class TokenViews(TokenObtainPairView):
    def get_serializer_class(self):
        return TokenSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def send_email(request):
    data = request.data
    message = data.get("message", "")
    name = data.get("name", "")
    email = data.get("email", "")
    message_footer = f"Dane:\nImię: {name}\nE-mail: {email}\n"

    full_message = f"{message}\n\n{message_footer}"
    send_mail(
        subject="Contact from {}".format(name),
        message=full_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[settings.EMAIL_HOST_USER],
    )
    response_data = {"message": "E-mail został wysłany.", "content": data}
    return Response(response_data)

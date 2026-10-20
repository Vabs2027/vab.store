from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from vabstore.serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = []#для регистрации авторизация не требуется.


    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {'detail': 'Користувача успішно зареєстровано'},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from .models import Client, Visit, ClientEvaluation
from .serializers import (
    ClientSerializer,
    VisitSerializer,
    ClientEvaluationSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.select_related('client').all()
    serializer_class = VisitSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class ClientEvaluationViewSet(viewsets.ModelViewSet):
    queryset = ClientEvaluation.objects.select_related('client').all()
    serializer_class = ClientEvaluationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    if not username or not new_password:
        return Response(
            {'error': 'Usuario y nueva contraseña son obligatorios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(username=username)
        user.password = make_password(new_password)
        user.save()

        return Response(
            {'message': 'Contraseña actualizada correctamente'},
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
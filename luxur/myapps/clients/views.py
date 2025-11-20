from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from luxur.myapps.clients.models import Client
from luxur.myapps.clients.serializers import ClientSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

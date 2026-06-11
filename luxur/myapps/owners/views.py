from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Owner
from .serializers import OwnerSerializer


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [AllowAny]
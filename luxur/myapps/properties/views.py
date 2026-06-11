from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Property, PropertyType, Amenity, PropertyAmenity
from .serializers import (
    PropertySerializer,
    PropertyTypeSerializer,
    AmenitySerializer,
    PropertyAmenitySerializer
)


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]


class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [AllowAny]


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [AllowAny]


class PropertyAmenityViewSet(viewsets.ModelViewSet):
    queryset = PropertyAmenity.objects.all()
    serializer_class = PropertyAmenitySerializer
    permission_classes = [AllowAny]
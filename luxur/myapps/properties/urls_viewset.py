from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OwnerViewSet, PropertyTypeViewSet, AmenityViewSet, PropertyViewSet

router = DefaultRouter()
router.register(r'owners', OwnerViewSet, basename='owner')
router.register(r'types', PropertyTypeViewSet, basename='propertytype')
router.register(r'amenities', AmenityViewSet, basename='amenity')
router.register(r'', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
]
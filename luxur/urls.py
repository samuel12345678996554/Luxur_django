"""
URL configuration for luxur project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from luxur.myapps.clients.views import (
    ClientViewSet,
    VisitViewSet,
    ClientEvaluationViewSet,
    reset_password
)

from luxur.myapps.properties.views import (
    PropertyViewSet,
    PropertyTypeViewSet,
    AmenityViewSet,
    PropertyAmenityViewSet
)

from luxur.myapps.contracts.views import (
    ContractViewSet,
    PaymentViewSet,
    ContractDocumentViewSet
)

from luxur.myapps.owners.views import OwnerViewSet


router = DefaultRouter()

router.register(r'clients', ClientViewSet, basename='client')
router.register(r'owners', OwnerViewSet, basename='owner')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'property-types', PropertyTypeViewSet, basename='property-type')
router.register(r'amenities', AmenityViewSet, basename='amenity')
router.register(r'property-amenities', PropertyAmenityViewSet, basename='property-amenity')
router.register(r'contracts', ContractViewSet, basename='contract')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'contract-documents', ContractDocumentViewSet, basename='contract-document')
router.register(r'visits', VisitViewSet, basename='visit')
router.register(r'client-evaluations', ClientEvaluationViewSet, basename='client-evaluation')


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/reset-password/', reset_password, name='reset_password'),

    path('api/', include(router.urls)),
]
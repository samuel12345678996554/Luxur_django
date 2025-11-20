from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from luxur.myapps.clients.views import ClientViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Creamos un router para los viewsets
router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rutas JWT
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API clients
    path('api/', include(router.urls)),
]

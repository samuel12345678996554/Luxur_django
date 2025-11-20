from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Routes
    path('api/clients/', include('luxur.myapps.clients.urls_viewset')),
    path('api/properties/', include('luxur.myapps.properties.urls_viewset')),
    path('api/contracts/', include('luxur.myapps.contracts.urls_viewset')),
]
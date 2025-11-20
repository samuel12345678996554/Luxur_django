from rest_framework.routers import DefaultRouter
from .views_viewset import ClientViewSet

router = DefaultRouter()
router.register(r'', ClientViewSet, basename='client')  # ← Cambia 'clients' por ''

urlpatterns = router.urls

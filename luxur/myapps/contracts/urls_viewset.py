from rest_framework.routers import DefaultRouter
from .views_viewset import ContractViewSet

router = DefaultRouter()
router.register(r'', ContractViewSet, basename='contract')

urlpatterns = router.urls
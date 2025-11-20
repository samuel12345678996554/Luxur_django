from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import Group, User
from django.utils import timezone
from .models import Client
from luxur.myapps.properties.models import Property
from .serializers import ClientSerializer
from luxur.myapps.utils.permissions import IsAdminUser, IsManagerOrAdmin, IsEmployeeOrAbove


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """Asignar permisos dinámicos según la acción"""
        if self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [IsManagerOrAdmin]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsManagerOrAdmin]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [perm() for perm in permission_classes]

    def get_queryset(self):
        """Filtrar clientes según grupo del usuario"""
        user_groups = self.request.user.groups.values_list('name', flat=True)
        if not user_groups:
            return Client.objects.none()  # Usuario sin grupos, no devuelve nada

        queryset = Client.objects.all()

        # Empleados solo ven clientes activos
        if 'Empleados' in user_groups and 'Gerentes' not in user_groups and 'Administradores' not in user_groups:
            queryset = queryset.filter(status='ACTIVE')

        return queryset

    def create(self, request, *args, **kwargs):
        user_groups = request.user.groups.values_list('name', flat=True)

        # Restricción gerentes
        if 'Gerentes' in user_groups and 'Administradores' not in user_groups:
            if request.data.get('status') == 'INACTIVE':
                return Response(
                    {"error": "Los gerentes no pueden crear clientes inactivos", "user_groups": list(user_groups)},
                    status=status.HTTP_403_FORBIDDEN
                )

        response = super().create(request, *args, **kwargs)

        if response.status_code == status.HTTP_201_CREATED:
            print(f"✓ Cliente '{response.data.get('name')}' creado por: {request.user.username} ({', '.join(user_groups)})")

        return response

    def update(self, request, *args, **kwargs):
        user_groups = request.user.groups.values_list('name', flat=True)

        if 'Gerentes' in user_groups and 'Administradores' not in user_groups:
            if request.data.get('status') == 'INACTIVE':
                return Response(
                    {"error": "Los gerentes no pueden desactivar clientes", "user_groups": list(user_groups)},
                    status=status.HTTP_403_FORBIDDEN
                )

        response = super().update(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            print(f"✓ Cliente actualizado por: {request.user.username} ({', '.join(user_groups)})")

        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        client_name = instance.name
        user_groups = request.user.groups.values_list('name', flat=True)

        response = super().destroy(request, *args, **kwargs)

        if response.status_code == status.HTTP_204_NO_CONTENT:
            print(f"⚠️  Cliente '{client_name}' eliminado por: {request.user.username} ({', '.join(user_groups)})")

        return response

    @action(detail=False, methods=['get'])
    def my_permissions(self, request):
        """Permisos del usuario autenticado"""
        user_groups = request.user.groups.values_list('name', flat=True)
        return Response({
            'username': request.user.username,
            'groups': list(user_groups),
            'permissions': {
                'can_view_client': request.user.has_perm('clients.view_client'),
                'can_add_client': request.user.has_perm('clients.add_client'),
                'can_change_client': request.user.has_perm('clients.change_client'),
                'can_delete_client': request.user.has_perm('clients.delete_client'),
            },
            'is_staff': request.user.is_staff,
            'is_superuser': request.user.is_superuser
        })

    @action(detail=False, methods=['get'], permission_classes=[IsEmployeeOrAbove])
    def statistics(self, request):
        """Estadísticas para empleados, gerentes y admin"""
        queryset = self.get_queryset()
        total = queryset.count()
        active = queryset.filter(status='ACTIVE').count()
        return Response({
            'total_clients': total,
            'active_clients': active,
            'inactive_clients': total - active,
            'generated_by': request.user.username,
            'timestamp': timezone.now().isoformat()
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def admin_only_stats(self, request):
        """Estadísticas avanzadas solo para administradores"""
        queryset = self.get_queryset()
        return Response({
            'total_users': User.objects.count(),
            'total_clients': queryset.count(),
            'clients_by_status': {
                'ACTIVE': queryset.filter(status='ACTIVE').count(),
                'INACTIVE': queryset.filter(status='INACTIVE').count(),
            },
            'users_by_group': {group.name: group.user_set.count() for group in Group.objects.all()},
            'generated_by': request.user.username
        })

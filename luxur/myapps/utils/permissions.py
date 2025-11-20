from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """Solo administradores o superusuarios pueden modificar datos"""
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user and request.user.groups.filter(name='Administradores').exists()


class IsManagerOrAdmin(permissions.BasePermission):
    """Administradores, gerentes o superusuarios pueden crear o actualizar"""
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user and request.user.groups.filter(name__in=['Administradores','Gerentes']).exists()


class IsEmployeeOrAbove(permissions.BasePermission):
    """Empleados, gerentes, administradores o superusuarios"""
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return request.user and request.user.groups.filter(name__in=['Empleados','Gerentes','Administradores']).exists()


class ModelPermissions(permissions.DjangoModelPermissions):
    """Permisos Django por modelo adaptados a JWT"""
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': [],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
        'PATCH': ['%(app_label)s.change_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }

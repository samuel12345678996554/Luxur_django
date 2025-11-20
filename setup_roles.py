import os
import django
from django.utils import timezone

# ===================== CONFIGURACIÓN DEL ENTORNO DJANGO =====================
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'luxur.settings')
django.setup()

from django.contrib.auth.models import Group, Permission, User
from django.contrib.contenttypes.models import ContentType

from luxur.myapps.clients.models import Client
from luxur.myapps.contracts.models import Contract
from luxur.myapps.properties.models import Property

# ===================== CREAR GRUPOS Y PERMISOS =====================
def create_groups_and_permissions():
    print("🔧 Configurando grupos y permisos...")

    # ======== Crear grupos ========
    admin_group, _ = Group.objects.get_or_create(name='Administradores')
    manager_group, _ = Group.objects.get_or_create(name='Gerentes')
    employee_group, _ = Group.objects.get_or_create(name='Empleados')
    client_group, _ = Group.objects.get_or_create(name='Clientes')

    # ======== ContentTypes ========
    client_ct = ContentType.objects.get_for_model(Client)
    contract_ct = ContentType.objects.get_for_model(Contract)
    property_ct = ContentType.objects.get_for_model(Property)

    print("\n📋 Configurando permisos por grupo...")

    # ======== ADMINISTRADORES: Todos los permisos ========
    admin_permissions = Permission.objects.filter(
        content_type__in=[client_ct, contract_ct, property_ct]
    )
    admin_group.permissions.set(admin_permissions)
    print(f"✓ Administradores: {admin_permissions.count()} permisos (CRUD completo)")

    # ======== GERENTES: CRUD excepto eliminar ========
    manager_permissions = Permission.objects.filter(
        content_type__in=[client_ct, contract_ct, property_ct]
    ).exclude(codename__startswith='delete_')
    manager_group.permissions.set(manager_permissions)
    print(f"✓ Gerentes: {manager_permissions.count()} permisos (CRU sin Delete)")

    # ======== EMPLEADOS: permisos específicos ========
    employee_permissions = []

    # Clientes: solo ver
    employee_permissions.extend(Permission.objects.filter(
        content_type=client_ct,
        codename__in=['view_client']
    ))

    # Contratos: CRUD completo
    employee_permissions.extend(Permission.objects.filter(
        content_type=contract_ct,
        codename__in=['add_contract', 'view_contract', 'change_contract', 'delete_contract']
    ))

    # Propiedades: Ver y actualizar
    employee_permissions.extend(Permission.objects.filter(
        content_type=property_ct,
        codename__in=['view_property', 'change_property']
    ))

    employee_group.permissions.set(employee_permissions)
    print(f"✓ Empleados: {len(employee_permissions)} permisos (CRUD contratos + R/U propiedades)")

    # ======== CLIENTES: solo ver datos propios ========
    client_permissions = []

    # Ver y cambiar su propio perfil
    client_permissions.extend(Permission.objects.filter(
        content_type=client_ct,
        codename__in=['view_client', 'change_client']
    ))

    # Ver propiedades disponibles
    client_permissions.extend(Permission.objects.filter(
        content_type=property_ct,
        codename__in=['view_property']
    ))

    # Ver sus contratos
    client_permissions.extend(Permission.objects.filter(
        content_type=contract_ct,
        codename__in=['view_contract']
    ))

    client_group.permissions.set(client_permissions)
    print(f"✓ Clientes: {len(client_permissions)} permisos (solo lectura y edición personal)")

    print("\n🎉 ¡Configuración de permisos completada!")

    # ======== Mostrar resumen ========
    print("\n📊 RESUMEN DE PERMISOS POR GRUPO:")
    print("=" * 60)

    for group in [admin_group, manager_group, employee_group, client_group]:
        print(f"\n{group.name}: {group.permissions.count()} permisos")
        for perm in group.permissions.all():
            print(f"  • {perm.content_type.model}: {perm.codename}")

# ===================== CREAR USUARIOS DE PRUEBA =====================
def create_test_users():
    print("\n👥 Creando usuarios de prueba...")

    users_data = [
        ('admin', 'admin@luxur.com', 'admin123', 'Administradores', True, True),
        ('manager', 'manager@luxur.com', 'manager123', 'Gerentes', True, False),
        ('employee', 'employee@luxur.com', 'employee123', 'Empleados', False, False),
        ('client', 'client@luxur.com', 'client123', 'Clientes', False, False),
    ]

    for username, email, password, group_name, is_staff, is_superuser in users_data:
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, email=email, password=password)
            user.is_staff = is_staff
            user.is_superuser = is_superuser
            user.save()

            group = Group.objects.get(name=group_name)
            user.groups.add(group)

            status = "superuser" if is_superuser else "staff" if is_staff else "user"
            print(f"✓ Usuario '{username}' creado ({group_name} - {status})")
        else:
            print(f"⚠️ Usuario '{username}' ya existe")

# ===================== EJECUTAR =====================
if __name__ == '__main__':
    create_groups_and_permissions()
    create_test_users()
    print("\n🚀 ¡Roles y usuarios creados correctamente para el sistema LUXUR!")

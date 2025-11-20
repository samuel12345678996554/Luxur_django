from django.db import models


class Owner(models.Model):
    name = models.CharField(max_length=100, help_text="Ingrese el nombre del propietario")
    contact = models.CharField(max_length=50, help_text="Ingrese un teléfono o contacto")
    email = models.EmailField(max_length=100, help_text="Ingrese el correo del propietario")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "propietario"
        verbose_name_plural = "propietarios"


class PropertyType(models.Model):
    name = models.CharField(max_length=50, help_text="Ingrese el tipo de propiedad (casa, apartamento, etc.)")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "tipo de propiedad"
        verbose_name_plural = "tipos de propiedades"


class Amenity(models.Model):
    name = models.CharField(max_length=50, help_text="Ingrese el nombre de la amenidad")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "amenidad"
        verbose_name_plural = "amenidades"


class Property(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Disponible'),
        ('RENTED', 'Alquilada'),
        ('SOLD', 'Vendida'),
        ('MAINTENANCE', 'En Mantenimiento'),
        ('ACTIVE', 'Activa'),
    ]
    
    title = models.CharField(max_length=100, help_text="Ingrese el título de la propiedad")
    description = models.TextField(blank=True, default='', help_text="Ingrese la descripción de la propiedad")
    address = models.CharField(max_length=200, help_text="Ingrese la dirección de la propiedad")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Ingrese el precio de la propiedad")

    owner = models.ForeignKey(
        Owner,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties',
        verbose_name="propietario"
    )

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="tipo de propiedad"
    )

    amenities = models.ManyToManyField(
        Amenity,
        through='PropertyAmenity',
        verbose_name="amenidades"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AVAILABLE',
        verbose_name="estado"
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="fecha de actualización")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "propiedad"
        verbose_name_plural = "propiedades"
        ordering = ['-created_at']


class PropertyAmenity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, verbose_name="propiedad")
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE, verbose_name="amenidad")

    def __str__(self):
        return f"{self.property.title} - {self.amenity.name}"

    class Meta:
        verbose_name = "amenidad de propiedad"
        verbose_name_plural = "amenidades de propiedades"
        unique_together = ['property', 'amenity']

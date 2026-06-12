from django.db import models
from luxur.myapps.owners.models import Owner


class PropertyType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Amenity(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Property(models.Model):

    STATUS_CHOICES = [
        ('AVAILABLE', 'Disponible'),
        ('RENTED', 'Alquilada'),
        ('SOLD', 'Vendida'),
        ('MAINTENANCE', 'En Mantenimiento'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    address = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    area = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rooms = models.IntegerField(default=0)

    owner = models.ForeignKey(
        Owner,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties'
    )

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    amenities = models.ManyToManyField(
        Amenity,
        through='PropertyAmenity',
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AVAILABLE'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class PropertyAmenity(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE
    )

    amenity = models.ForeignKey(
        Amenity,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ['property', 'amenity']
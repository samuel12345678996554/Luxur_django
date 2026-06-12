from django.db import models
from luxur.myapps.properties.models import Property


class Client(models.Model):
    cedula = models.CharField(
        max_length=20,
        unique=True
    )

    name = models.CharField(max_length=100)
    address = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Visit(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('COMPLETED', 'Realizada'),
        ('INTERESTED', 'Interesado'),
        ('NOT_INTERESTED', 'No interesado'),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='visits'
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='visits',
        null=True,
        blank=True
)

    date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    observations = models.TextField(
        blank=True
    )

    result = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.client.name} - {self.property.title}"


class ClientEvaluation(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='evaluations'
    )

    rating = models.IntegerField()
    comments = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluación de {self.client.name} ({self.rating}/5)"
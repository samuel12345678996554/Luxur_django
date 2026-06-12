from django.db import models
from luxur.myapps.clients.models import Client
from luxur.myapps.properties.models import Property


class Contract(models.Model):

    CONTRACT_TYPE_CHOICES = [
        ('RENT', 'Alquiler'),
        ('SALE', 'Venta'),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='contracts',
        verbose_name="cliente"
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='contracts',
        verbose_name="propiedad"
    )

    contract_type = models.CharField(
        max_length=10,
        choices=CONTRACT_TYPE_CHOICES,
        default='RENT',
        verbose_name="tipo de contrato"
    )

    start_date = models.DateField(
        help_text="Ingrese la fecha de inicio del contrato",
        verbose_name="fecha de inicio"
    )

    end_date = models.DateField(
        help_text="Ingrese la fecha de finalización del contrato",
        verbose_name="fecha de finalización"
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Ingrese el monto total del contrato",
        verbose_name="monto total"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="fecha de creación"
    )

    def __str__(self):
        return f"{self.get_contract_type_display()} - {self.client.name}"

    class Meta:
        verbose_name = "contrato"
        verbose_name_plural = "contratos"


class ContractDocument(models.Model):
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name="contrato"
    )

    name = models.CharField(
        max_length=100,
        help_text="Ingrese el nombre del documento",
        verbose_name="nombre del documento"
    )

    file = models.FileField(
        upload_to='contract_documents/',
        verbose_name="archivo"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="fecha de subida"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "documento de contrato"
        verbose_name_plural = "documentos de contratos"


class Payment(models.Model):
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name="contrato"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Ingrese el monto del pago",
        verbose_name="monto"
    )

    date = models.DateField(
        help_text="Ingrese la fecha del pago",
        verbose_name="fecha"
    )

    method = models.CharField(
        max_length=50,
        help_text="Ingrese el método de pago (efectivo, transferencia, etc.)",
        verbose_name="método de pago"
    )

    def __str__(self):
        return f"Pago de {self.amount} - {self.contract.client.name}"

    class Meta:
        verbose_name = "pago"
        verbose_name_plural = "pagos"
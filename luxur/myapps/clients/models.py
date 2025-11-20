from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=100, help_text="Ingrese el nombre del cliente")
    address = models.CharField(max_length=150, help_text="Ingrese la dirección del cliente")
    phone = models.CharField(max_length=15, help_text="Ingrese el teléfono del cliente")
    email = models.EmailField(max_length=100, help_text="Ingrese el correo electrónico del cliente")
    password = models.CharField(max_length=100, help_text="Ingrese la contraseña del cliente")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "cliente"
        verbose_name_plural = "clientes"


class Visit(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='visits', verbose_name="cliente")
    date = models.DateField(help_text="Ingrese la fecha de la visita", verbose_name="fecha de visita")
    observations = models.TextField(blank=True, help_text="Ingrese observaciones de la visita", verbose_name="observaciones")

    def __str__(self):
        return f"Visita de {self.client.name} el {self.date}"

    class Meta:
        verbose_name = "visita"
        verbose_name_plural = "visitas"


class ClientEvaluation(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='evaluations', verbose_name="cliente")
    rating = models.IntegerField(help_text="Ingrese una calificación de 1 a 5", verbose_name="calificación")
    comments = models.TextField(blank=True, help_text="Ingrese comentarios adicionales", verbose_name="comentarios")
    date = models.DateTimeField(auto_now_add=True, verbose_name="fecha de evaluación")

    def __str__(self):
        return f"Evaluación de {self.client.name} ({self.rating}/5)"

    class Meta:
        verbose_name = "evaluación de cliente"
        verbose_name_plural = "evaluaciones de clientes"

from django.db import models


class Owner(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "propietario"
        verbose_name_plural = "propietarios"
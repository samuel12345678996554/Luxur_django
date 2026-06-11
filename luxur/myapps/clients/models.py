from django.db import models


class Client(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Visit(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='visits')
    date = models.DateField()
    observations = models.TextField(blank=True)

    def __str__(self):
        return f"Visita de {self.client.name} el {self.date}"


class ClientEvaluation(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='evaluations')
    rating = models.IntegerField()
    comments = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluación de {self.client.name} ({self.rating}/5)"
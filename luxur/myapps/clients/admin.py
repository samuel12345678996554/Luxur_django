from django.contrib import admin
from .models import Client, Visit, ClientEvaluation

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')

@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ('client', 'date', 'observations')
    list_filter = ('date',)
    search_fields = ('client__name',)

@admin.register(ClientEvaluation)
class ClientEvaluationAdmin(admin.ModelAdmin):
    list_display = ('client', 'rating', 'date')
    list_filter = ('rating',)
    search_fields = ('client__name',)

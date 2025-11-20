from django.contrib import admin
from .models import Contract, ContractDocument, Payment

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('client', 'property', 'start_date', 'end_date', 'total_amount')
    list_filter = ('start_date', 'end_date')
    search_fields = ('client__name', 'property__title')

@admin.register(ContractDocument)
class ContractDocumentAdmin(admin.ModelAdmin):
    list_display = ('contract', 'name', 'uploaded_at')
    search_fields = ('name',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('contract', 'amount', 'date', 'method')
    list_filter = ('date',)
    search_fields = ('contract__client__name',)

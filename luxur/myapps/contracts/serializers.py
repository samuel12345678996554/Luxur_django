from rest_framework import serializers
from .models import Contract
from luxur.myapps.clients.models import Client
from luxur.myapps.properties.models import Property

class ContractSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    
    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        required=True,
        error_messages={
            'required': 'El campo client es requerido',
            'does_not_exist': 'El cliente con id={value} no existe'
        }
    )
    
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        required=True,
        error_messages={
            'required': 'El campo property es requerido',
            'does_not_exist': 'La propiedad con id={value} no existe'
        }
    )
    
    class Meta:
        model = Contract
        fields = ['id', 'client', 'client_name', 'property', 'property_title',
                  'start_date', 'end_date', 'total_amount', 'created_at']
        read_only_fields = ['created_at']
    
    def validate_total_amount(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto total debe ser mayor a 0")
        return value
    
    def validate(self, data):
        """Validar que end_date sea posterior a start_date"""
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError({
                'end_date': 'La fecha de finalización debe ser posterior a la fecha de inicio'
            })
        return data
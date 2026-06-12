from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    contract_info = serializers.CharField(
        source='contract.__str__',
        read_only=True
    )

    client_name = serializers.CharField(
        source='contract.client.name',
        read_only=True
    )

    client_cedula = serializers.CharField(
        source='contract.client.cedula',
        read_only=True
    )

    property_title = serializers.CharField(
        source='contract.property.title',
        read_only=True
    )

    contract_type = serializers.CharField(
        source='contract.contract_type',
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            'id',
            'contract',

            # Contrato
            'contract_info',
            'contract_type',

            # Cliente
            'client_name',
            'client_cedula',

            # Propiedad
            'property_title',

            # Pago
            'amount',
            'date',
            'method'
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El monto debe ser mayor a 0"
            )
        return value
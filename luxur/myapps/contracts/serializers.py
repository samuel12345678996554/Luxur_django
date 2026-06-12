from rest_framework import serializers

from .models import Contract, Payment, ContractDocument
from luxur.myapps.clients.models import Client
from luxur.myapps.properties.models import Property


class ContractSerializer(serializers.ModelSerializer):

    client_name = serializers.CharField(
        source='client.name',
        read_only=True
    )

    client_cedula = serializers.CharField(
        source='client.cedula',
        read_only=True
    )

    property_title = serializers.CharField(
        source='property.title',
        read_only=True
    )

    client = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all()
    )

    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all()
    )

    class Meta:
        model = Contract

        fields = [
            'id',

            'client',
            'client_name',
            'client_cedula',

            'property',
            'property_title',

            'contract_type',

            'start_date',
            'end_date',
            'total_amount',
            'created_at'
        ]

        read_only_fields = ['created_at']

    def validate_total_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El monto total debe ser mayor a 0"
            )
        return value

    def validate(self, data):
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError({
                'end_date':
                'La fecha de finalización debe ser posterior a la fecha de inicio'
            })
        return data


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

            'contract_info',
            'contract_type',

            'client_name',
            'client_cedula',

            'property_title',

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


class ContractDocumentSerializer(serializers.ModelSerializer):

    contract_info = serializers.CharField(
        source='contract.__str__',
        read_only=True
    )

    class Meta:
        model = ContractDocument

        fields = [
            'id',
            'contract',
            'contract_info',
            'name',
            'file',
            'uploaded_at'
        ]

        read_only_fields = ['uploaded_at']
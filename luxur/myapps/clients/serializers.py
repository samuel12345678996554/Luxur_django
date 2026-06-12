from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import Client, Visit, ClientEvaluation


class ClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Client
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        if password:
            validated_data['password'] = make_password(password)
        return super().update(instance, validated_data)


class VisitSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = Visit

        fields = [
            'id',

            # Cliente
            'client',
            'client_name',
            'client_cedula',

            # Propiedad
            'property',
            'property_title',

            # Visita
            'date',
            'status',
            'observations',
            'result'
        ]


class ClientEvaluationSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)

    class Meta:
        model = ClientEvaluation
        fields = '__all__'
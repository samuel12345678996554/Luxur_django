from rest_framework import serializers
from .models import Client
from luxur.myapps.properties.models import Property
from django.contrib.auth.hashers import make_password

class ClientSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Client
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if password:
            # Hashear la contraseña antes de guardar
            validated_data['password'] = make_password(password)
        client = super().create(validated_data)
        return client

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            validated_data['password'] = make_password(password)
        client = super().update(instance, validated_data)
        return client

class PropertySerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Property
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'owner' in validated_data and validated_data['owner'] is None:
            # Permitir quitar propietario
            pass
        return super().update(instance, validated_data)

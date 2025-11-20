from rest_framework import serializers
from .models import Owner, PropertyType, Amenity, Property

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'name', 'contact', 'email']


class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = ['id', 'name']


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']


class PropertySerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    property_type_name = serializers.CharField(source='property_type.name', read_only=True)

    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        required=False,
        allow_null=True
    )

    property_type = serializers.PrimaryKeyRelatedField(
        queryset=PropertyType.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'address', 'price',
            'owner', 'owner_name',
            'property_type', 'property_type_name',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value

    def validate(self, data):
        if not data.get('description'):
            data['description'] = ''
        return data

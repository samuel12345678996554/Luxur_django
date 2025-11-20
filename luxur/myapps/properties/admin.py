from django.contrib import admin
from .models import Owner, PropertyType, Amenity, Property, PropertyAmenity

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'contact', 'email']
    search_fields = ['name', 'email']

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

# Inline para mostrar amenidades dentro de Property
class PropertyAmenityInline(admin.TabularInline):
    model = PropertyAmenity
    extra = 1
    verbose_name = "Amenidad"
    verbose_name_plural = "Amenidades"

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'address', 'price', 'status', 'owner', 'property_type', 'created_at']
    list_filter = ['status', 'property_type', 'owner', 'created_at']
    search_fields = ['title', 'address', 'owner__name']
    inlines = [PropertyAmenityInline]
    date_hierarchy = 'created_at'

@admin.register(PropertyAmenity)
class PropertyAmenityAdmin(admin.ModelAdmin):
    list_display = ['id', 'property', 'amenity']
    list_filter = ['property', 'amenity']
    search_fields = ['property__title', 'amenity__name']
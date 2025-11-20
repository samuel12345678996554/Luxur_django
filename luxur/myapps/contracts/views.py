from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Contract
from .serializers import ContractSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create para mejor manejo de errores"""
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            # Retornar errores más detallados
            return Response({
                'success': False,
                'errors': serializer.errors,
                'message': 'Error en la validación de datos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Contrato creado exitosamente'
        }, status=status.HTTP_201_CREATED)


# Mantén esta función si la necesitas para alguna URL
from django.http import HttpResponse

def home(request):
    return HttpResponse("Bienvenido a la aplicación Contracts de Luxur")
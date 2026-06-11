from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Contract, Payment, ContractDocument
from .serializers import (
    ContractSerializer,
    PaymentSerializer,
    ContractDocumentSerializer
)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.select_related('client', 'property').all()
    serializer_class = ContractSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
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


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('contract', 'contract__client').all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]


class ContractDocumentViewSet(viewsets.ModelViewSet):
    queryset = ContractDocument.objects.select_related('contract').all()
    serializer_class = ContractDocumentSerializer
    permission_classes = [AllowAny]
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

    queryset = Contract.objects.select_related(
        'client',
        'property'
    ).all()

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

        contract = serializer.save()

        # Actualizar estado de la propiedad
        property_obj = contract.property

        if contract.contract_type == 'RENT':
            property_obj.status = 'RENTED'

        elif contract.contract_type == 'SALE':
            property_obj.status = 'SOLD'

        property_obj.save()

        return Response({
            'success': True,
            'data': ContractSerializer(contract).data,
            'message': 'Contrato creado exitosamente'
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', False)

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )

        serializer.is_valid(raise_exception=True)

        contract = serializer.save()

        # Actualizar estado de la propiedad
        property_obj = contract.property

        if contract.contract_type == 'RENT':
            property_obj.status = 'RENTED'

        elif contract.contract_type == 'SALE':
            property_obj.status = 'SOLD'

        property_obj.save()

        return Response({
            'success': True,
            'data': ContractSerializer(contract).data,
            'message': 'Contrato actualizado exitosamente'
        })


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.select_related(
        'contract',
        'contract__client'
    ).all()

    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]


class ContractDocumentViewSet(viewsets.ModelViewSet):

    queryset = ContractDocument.objects.select_related(
        'contract'
    ).all()

    serializer_class = ContractDocumentSerializer
    permission_classes = [AllowAny]
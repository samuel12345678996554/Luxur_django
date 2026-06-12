import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { PaymentService } from '../../../services/payment.service';
import { PaymentResponseI } from '../../../models/payment';

@Component({
  selector: 'app-payment-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    InputTextModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class Getall implements OnInit, OnDestroy {

  payments: PaymentResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private paymentService: PaymentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPayments();

    this.subscription.add(
      this.paymentService.payments$.subscribe(payments => {
        this.payments = payments;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPayments(): void {
    this.loading = true;

    this.subscription.add(
      this.paymentService.getAllPayments().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los pagos'
          });
        }
      })
    );
  }

  confirmDelete(payment: PaymentResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el pago #${payment.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deletePayment(payment.id!)
    });
  }

  deletePayment(id: number): void {
    this.subscription.add(
      this.paymentService.deletePayment(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Pago eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el pago'
          });
        }
      })
    );
  }

  getContractTypeLabel(type: string): string {
    switch (type) {
      case 'SALE':
        return 'Venta';

      case 'RENT':
        return 'Alquiler';

      default:
        return type || 'N/A';
    }
  }

  getMethodLabel(method: string): string {
    switch (method) {
      case 'CASH':
        return 'Efectivo';

      case 'TRANSFER':
        return 'Transferencia';

      case 'CARD':
        return 'Tarjeta';

      case 'NEQUI':
        return 'Nequi';

      case 'DAVIPLATA':
        return 'Daviplata';

      default:
        return method || 'N/A';
    }
  }
}
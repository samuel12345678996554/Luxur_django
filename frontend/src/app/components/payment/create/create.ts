import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PaymentService } from '../../../services/payment.service';
import { ContractService } from '../../../services/contract';
import { PaymentI } from '../../../models/payment';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create implements OnInit {

  contracts: any[] = [];

  payment: PaymentI = {
    contract: null,
    amount: 0,
    date: '',
    method: ''
  };

  loading = false;

  constructor(
    private paymentService: PaymentService,
    private contractService: ContractService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.contractService.getAllContracts().subscribe({
      next: (data: any) => {
        this.contracts = Array.isArray(data) ? data : data.results || [];
      }
    });
  }

  save(): void {
    if (
      this.payment.contract === null ||
      this.payment.amount <= 0 ||
      !this.payment.date ||
      !this.payment.method.trim()
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Todos los campos son obligatorios'
      });
      return;
    }

    this.loading = true;

    const payload: PaymentI = {
      ...this.payment,
      date: this.formatDate(this.payment.date)
    };

    this.paymentService.createPayment(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Pago creado correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/payment']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el pago'
        });
      }
    });
  }

  formatDate(value: any): string {
    if (!value) return '';

    const date = new Date(value);
    return date.toISOString().split('T')[0];
  }
}
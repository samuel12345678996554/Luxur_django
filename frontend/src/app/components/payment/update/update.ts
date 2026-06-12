import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

import {
  PaymentI,
  PaymentResponseI
} from '../../../models/payment';

@Component({
  selector: 'app-payment-update',
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
  templateUrl: './update.html',
  styleUrls: ['./update.css']
})
export class Update implements OnInit {

  id!: number;

  contracts: any[] = [];

  payment: PaymentI = {
    contract: null,
    amount: 0,
    date: '',
    method: ''
  };

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadContracts();
    this.loadPayment();

  }

  loadContracts(): void {

    this.contractService.getAllContracts().subscribe({

      next: (data: any) => {

        const contracts =
          Array.isArray(data)
            ? data
            : data.results || [];

        this.contracts = contracts.map((c: any) => ({
          label: `${c.client_name} - ${c.property_title}`,
          value: c.id
        }));

      },

      error: (err) => {

        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los contratos'
        });

      }

    });

  }

  loadPayment(): void {

    this.paymentService.getPaymentById(this.id).subscribe({

      next: (data: PaymentResponseI) => {

        this.payment = {
          contract: data.contract,
          amount: data.amount,
          date: data.date,
          method: data.method
        };

      },

      error: () => {
        this.router.navigate(['/payment']);
      }

    });

  }

  update(): void {

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

    const payload: PaymentI = {
      ...this.payment,
      date: this.formatDate(this.payment.date)
    };

    this.loading = true;

    this.paymentService.updatePayment(
      this.id,
      payload
    ).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Pago actualizado correctamente'
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
          detail: 'No se pudo actualizar el pago'
        });

      }

    });

  }

  formatDate(value: any): string {

    if (!value) return '';

    if (typeof value === 'string') {
      return value;
    }

    const date = new Date(value);

    return date.toISOString().split('T')[0];

  }

}
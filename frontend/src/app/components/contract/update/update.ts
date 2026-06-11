import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ContractService } from '../../../services/contract';
import { ClientService } from '../../../services/client.service';
import { ClientResponseI } from '../../../models/client';

@Component({
  selector: 'app-update',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    InputNumber,
    DatePicker,
    Select, 
    ToastModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  contractId: number = 0;
  clients: ClientResponseI[] = [];
  clientOptions: any[] = [];
  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' },
    { label: 'Completado', value: 'COMPLETED' },
    { label: 'Cancelado', value: 'CANCELLED' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      client: [null, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractId = parseInt(id);
      this.loadClients();
    }
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientOptions = clients.map(client => ({
          label: client.name,
          value: client.id
        }));
        this.loadContract();
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes'
        });
      }
    });
  }

  loadContract(): void {
    this.loading = true;
    this.contractService.getContractById(this.contractId).subscribe({
      next: (contract) => {
        this.form.patchValue({
          client: contract.client,
          start_date: new Date(contract.start_date),
          end_date: new Date(contract.end_date),
          total_amount: contract.total_amount,
          status: contract.status
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el contrato'
        });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const contractData = {
        ...this.form.value,
        start_date: this.formatDate(this.form.value.start_date),
        end_date: this.formatDate(this.form.value.end_date)
      };

      this.contractService.updateContract(this.contractId, contractData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contrato actualizado correctamente'
          });
          setTimeout(() => {
            this.router.navigate(['/contracts']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating contract:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el contrato'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/contracts']);
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    }
    return '';
  }
}
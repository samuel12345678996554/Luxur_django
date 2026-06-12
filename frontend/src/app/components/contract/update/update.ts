import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ContractService } from '../../../services/contract';
import { ClientService } from '../../../services/client.service';
import { PropertyService } from '../../../services/property.service';

import { ClientResponseI } from '../../../models/client';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    ToastModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {

  form: FormGroup;
  loading = false;
  contractId = 0;

  clients: ClientResponseI[] = [];
  clientOptions: any[] = [];

  properties: any[] = [];
  propertyOptions: any[] = [];

  contractTypeOptions = [
    {
      label: 'Alquiler',
      value: 'RENT'
    },
    {
      label: 'Venta',
      value: 'SALE'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private clientService: ClientService,
    private propertyService: PropertyService,
    private messageService: MessageService
  ) {

    this.form = this.fb.group({

      client: [
        null,
        Validators.required
      ],

      property: [
        null,
        Validators.required
      ],

      contract_type: [
        'RENT',
        Validators.required
      ],

      start_date: [
        '',
        Validators.required
      ],

      end_date: [
        '',
        Validators.required
      ],

      total_amount: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]

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
          label: `${client.cedula} - ${client.name}`,
          value: client.id
        }));

        this.loadProperties();
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

  loadProperties(): void {

    this.propertyService.getAllProperties().subscribe({

      next: (properties) => {

        this.properties = properties;

        this.propertyOptions = properties.map(property => ({
          label: property.title,
          value: property.id
        }));

        this.loadContract();
      },

      error: (error) => {

        console.error('Error loading properties:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las propiedades'
        });

      }

    });

  }

  loadContract(): void {

    this.loading = true;

    this.contractService.getContractById(this.contractId).subscribe({

      next: (contract: any) => {

        this.form.patchValue({

          client: contract.client,

          property: contract.property,

          contract_type:
            contract.contract_type,

          start_date:
            new Date(contract.start_date),

          end_date:
            new Date(contract.end_date),

          total_amount:
            contract.total_amount

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

    if (this.form.invalid) {

      this.markFormGroupTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });

      return;

    }

    this.loading = true;

    const contractData = {

      ...this.form.value,

      start_date: this.formatDate(
        this.form.value.start_date
      ),

      end_date: this.formatDate(
        this.form.value.end_date
      )

    };

    this.contractService.updateContract(
      this.contractId,
      contractData
    ).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contrato actualizado correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/contract']);
        }, 1000);

      },

      error: (error) => {

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el contrato'
        });

        this.loading = false;

      }

    });

  }

  cancelar(): void {
    this.router.navigate(['/contract']);
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

      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }

      if (field.errors['min']) {
        return `El valor mínimo es ${field.errors['min'].min}`;
      }

    }

    return '';

  }

}
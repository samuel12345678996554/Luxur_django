import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ContractService } from '../../../services/contract';
import { ClientService } from '../../../services/client.service';
import { PropertyService } from '../../../services/property.service';

import { ClientResponseI } from '../../../models/client';
import { PropertyResponseI } from '../../../models/property';

@Component({
  selector: 'app-create',
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
  templateUrl: './create.html',
  styleUrl: './create.css',
  providers: [MessageService]
})
export class Create implements OnInit {

  form: FormGroup;
  loading = false;

  clients: ClientResponseI[] = [];
  properties: PropertyResponseI[] = [];

  clientOptions: any[] = [];
  propertyOptions: any[] = [];

  statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' },
    { label: 'Completado', value: 'COMPLETED' },
    { label: 'Cancelado', value: 'CANCELLED' }
  ];

  contractTypeOptions = [
    { label: 'Alquiler', value: 'RENT' },
    { label: 'Venta', value: 'SALE' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractService: ContractService,
    private clientService: ClientService,
    private propertyService: PropertyService,
    private messageService: MessageService
  ) {

    this.form = this.fb.group({
      client: [null, Validators.required],

      property: [null, Validators.required],

      contract_type: ['RENT', Validators.required],

      start_date: ['', Validators.required],

      end_date: ['', Validators.required],

      total_amount: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      status: ['ACTIVE', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProperties();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {

        this.clients = clients;

        this.clientOptions = clients.map(client => ({
          label: client.name,
          value: client.id
        }));

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

        this.propertyOptions = properties.map(prop => ({
          label: prop.title,
          value: prop.id
        }));

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

  submit(): void {

    if (this.form.valid) {

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

      console.log('Contrato enviado:', contractData);

      this.contractService.createContract(contractData)
        .subscribe({

          next: () => {

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contrato creado correctamente'
            });

            setTimeout(() => {
              this.router.navigate(['/contract']);
            }, 1000);

          },

          error: (error) => {

            console.error(
              'Error creating contract:',
              error
            );

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el contrato'
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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { VisitService } from '../../../services/visit.service';
import { ClientService } from '../../../services/client.service';
import { PropertyService } from '../../../services/property.service';

import { VisitI } from '../../../models/visit';

@Component({
  selector: 'app-visit-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create implements OnInit {

  clients: any[] = [];
  properties: any[] = [];

  selectedProperty: any = null;

  statusOptions = [
    {
      label: 'Pendiente',
      value: 'PENDING'
    },
    {
      label: 'Realizada',
      value: 'COMPLETED'
    },
    {
      label: 'Interesado',
      value: 'INTERESTED'
    },
    {
      label: 'No interesado',
      value: 'NOT_INTERESTED'
    }
  ];

  visit: VisitI = {
    client: null,
    property: null,
    date: '',
    status: 'PENDING',
    observations: '',
    result: ''
  };

  loading = false;

  constructor(
    private visitService: VisitService,
    private clientService: ClientService,
    private propertyService: PropertyService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.loadClients();
    this.loadProperties();

  }

  loadClients(): void {

    this.clientService.getAllClients().subscribe({
      next: (data: any) => {
        this.clients = Array.isArray(data)
          ? data
          : data.results || [];
      }
    });

  }

  loadProperties(): void {

    this.propertyService.getAllProperties().subscribe({
      next: (data: any) => {
        this.properties = Array.isArray(data)
          ? data
          : data.results || [];
      }
    });

  }

  onPropertyChange(propertyId: number): void {

    this.selectedProperty =
      this.properties.find(
        p => p.id === propertyId
      );

  }

  save(): void {

    if (
      this.visit.client === null ||
      this.visit.property === null ||
      !this.visit.date
    ) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail:
          'Cliente, propiedad y fecha son obligatorios'
      });

      return;
    }

    const payload: VisitI = {
      ...this.visit,
      date: this.formatDate(this.visit.date)
    };

    this.loading = true;

    this.visitService.createVisit(payload).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Visita creada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/visit']);
        }, 1000);

      },

      error: () => {

        this.loading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la visita'
        });

      }

    });

  }

  formatDate(value: any): string {

    if (!value) return '';

    const date = new Date(value);

    return date.toISOString().split('T')[0];

  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'PENDING':
        return 'Pendiente';

      case 'COMPLETED':
        return 'Realizada';

      case 'INTERESTED':
        return 'Interesado';

      case 'NOT_INTERESTED':
        return 'No interesado';

      default:
        return status;
    }

  }
}
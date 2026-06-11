import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { VisitI, VisitResponseI } from '../../../models/visit';

@Component({
  selector: 'app-visit-update',
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
  templateUrl: './update.html',
  styleUrls: ['./update.css']
})
export class Update implements OnInit {

  id!: number;
  clients: any[] = [];

  visit: VisitI = {
    client: null,
    date: '',
    observations: ''
  };

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitService: VisitService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadClients();
    this.loadVisit();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: any) => {
        this.clients = Array.isArray(data) ? data : data.results || [];
      }
    });
  }

  loadVisit(): void {
    this.visitService.getVisitById(this.id).subscribe({
      next: (data: VisitResponseI) => {
        this.visit = {
          client: data.client,
          date: data.date,
          observations: data.observations
        };
      },
      error: () => {
        this.router.navigate(['/visit']);
      }
    });
  }

  update(): void {
    if (this.visit.client === null || !this.visit.date) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Cliente y fecha son obligatorios'
      });
      return;
    }

    const payload: VisitI = {
      ...this.visit,
      date: this.formatDate(this.visit.date)
    };

    this.loading = true;

    this.visitService.updateVisit(this.id, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Visita actualizada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/visit']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la visita'
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
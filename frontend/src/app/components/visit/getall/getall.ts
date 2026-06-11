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

import { VisitService } from '../../../services/visit.service';
import { VisitResponseI } from '../../../models/visit';

@Component({
  selector: 'app-visit-getall',
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

  visits: VisitResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private visitService: VisitService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadVisits();

    this.subscription.add(
      this.visitService.visits$.subscribe(items => {
        this.visits = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadVisits(): void {
    this.loading = true;

    this.subscription.add(
      this.visitService.getAllVisits().subscribe({
        next: () => this.loading = false,
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las visitas'
          });
        }
      })
    );
  }

  confirmDelete(visit: VisitResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la visita #${visit.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteVisit(visit.id!)
    });
  }

  deleteVisit(id: number): void {
    this.subscription.add(
      this.visitService.deleteVisit(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Visita eliminada correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la visita'
          });
        }
      })
    );
  }
}
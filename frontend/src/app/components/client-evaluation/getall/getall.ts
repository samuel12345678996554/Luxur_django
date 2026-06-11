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

import { ClientEvaluationService } from '../../../services/client-evaluation.service';
import { ClientEvaluationResponseI } from '../../../models/client-evaluation';

@Component({
  selector: 'app-client-evaluation-getall',
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

  evaluations: ClientEvaluationResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private evaluationService: ClientEvaluationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();

    this.subscription.add(
      this.evaluationService.evaluations$.subscribe(items => {
        this.evaluations = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadEvaluations(): void {
    this.loading = true;

    this.subscription.add(
      this.evaluationService.getAllEvaluations().subscribe({
        next: () => this.loading = false,
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las evaluaciones'
          });
        }
      })
    );
  }

  confirmDelete(
    evaluation: ClientEvaluationResponseI
  ): void {
    this.confirmationService.confirm({
      message: `¿Eliminar evaluación #${evaluation.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteEvaluation(evaluation.id!)
    });
  }

  deleteEvaluation(id: number): void {
    this.subscription.add(
      this.evaluationService.deleteEvaluation(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Evaluación eliminada correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la evaluación'
          });
        }
      })
    );
  }
}
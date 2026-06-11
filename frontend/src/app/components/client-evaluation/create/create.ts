import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ClientEvaluationService } from '../../../services/client-evaluation.service';
import { ClientService } from '../../../services/client.service';
import { ClientEvaluationI } from '../../../models/client-evaluation';

@Component({
  selector: 'app-client-evaluation-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create implements OnInit {

  clients: any[] = [];

  evaluation: ClientEvaluationI = {
    client: null,
    rating: 1,
    comments: ''
  };

  loading = false;

  constructor(
    private evaluationService: ClientEvaluationService,
    private clientService: ClientService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: any) => {
        this.clients = Array.isArray(data) ? data : data.results || [];
      }
    });
  }

  save(): void {
    if (this.evaluation.client === null || this.evaluation.rating < 1 || this.evaluation.rating > 5) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione un cliente y una calificación entre 1 y 5'
      });
      return;
    }

    this.loading = true;

    this.evaluationService.createEvaluation(this.evaluation).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Evaluación creada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/client-evaluation']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la evaluación'
        });
      }
    });
  }
}
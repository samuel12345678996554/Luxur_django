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

import { ContractDocumentService } from '../../../services/contract-document.service';
import { ContractDocumentResponseI } from '../../../models/contract-document';

@Component({
  selector: 'app-contract-document-getall',
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

  documents: ContractDocumentResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private documentService: ContractDocumentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();

    this.subscription.add(
      this.documentService.documents$.subscribe(items => {
        this.documents = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDocuments(): void {
    this.loading = true;

    this.subscription.add(
      this.documentService.getAllDocuments().subscribe({
        next: () => this.loading = false,
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los documentos'
          });
        }
      })
    );
  }

  confirmDelete(document: ContractDocumentResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${document.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteDocument(document.id!)
    });
  }

  deleteDocument(id: number): void {
    this.subscription.add(
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Documento eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el documento'
          });
        }
      })
    );
  }
}
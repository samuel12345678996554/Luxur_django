import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { ContractService } from '../../../services/contract';
import { ContractResponseI } from '../../../models/contract';

@Component({
  selector: 'app-contract-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    TagModule,
    InputTextModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class Getall implements OnInit, OnDestroy {
  contracts: ContractResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private contractService: ContractService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadContracts();

    this.subscription.add(
      this.contractService.contracts$.subscribe(contracts => {
        this.contracts = contracts;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadContracts(): void {
    this.loading = true;

    this.subscription.add(
      this.contractService.getAllContracts().subscribe({
        next: (contracts) => {
          this.contracts = contracts;
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los contratos'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(contract: ContractResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el contrato #${contract.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteContract(contract.id!)
    });
  }

  deleteContract(id: number): void {
    this.subscription.add(
      this.contractService.deleteContract(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Contrato eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el contrato'
          });
        }
      })
    );
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'danger';
      case 'INACTIVE':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado'
    };

    return labels[status] || status;
  }
}
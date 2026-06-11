import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Subscription } from 'rxjs';

import { ClientService } from '../../../services/client.service';
import { ClientResponseI } from '../../../models/client';

@Component({
  selector: 'app-client-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    CardModule,
    InputTextModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class Getall implements OnInit, OnDestroy {

  clients: ClientResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadClients();

    this.subscription.add(
      this.clientService.clients$.subscribe(clientList => {
        this.clients = clientList;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadClients(): void {
    this.loading = true;

    this.subscription.add(
      this.clientService.getAllClients().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los clientes'
          });

          this.loading = false;
        }
      })
    );
  }

  confirmDelete(client: ClientResponseI): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminación',
      message: `¿Desea eliminar a ${client.name}?`,
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.deleteClient(client.id!);
      }
    });
  }

  deleteClient(id: number): void {
    this.subscription.add(
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el cliente'
          });
        }
      })
    );
  }
}
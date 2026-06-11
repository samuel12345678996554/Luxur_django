import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { OwnerService } from '../../../services/owner.service';
import { OwnerResponseI } from '../../../models/owner';

@Component({
  selector: 'app-owner-getall',
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
  owners: OwnerResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private ownerService: OwnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOwners();

    this.subscription.add(
      this.ownerService.owners$.subscribe(owners => {
        this.owners = owners;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOwners(): void {
    this.loading = true;

    this.subscription.add(
      this.ownerService.getAllOwners().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los propietarios'
          });
        }
      })
    );
  }

  confirmDelete(owner: OwnerResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${owner.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteOwner(owner.id!)
    });
  }

  deleteOwner(id: number): void {
    this.subscription.add(
      this.ownerService.deleteOwner(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Propietario eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el propietario'
          });
        }
      })
    );
  }
}
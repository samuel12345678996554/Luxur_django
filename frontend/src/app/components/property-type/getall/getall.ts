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

import { PropertyTypeService } from '../../../services/property-type.service';
import { PropertyTypeResponseI } from '../../../models/property-type';

@Component({
  selector: 'app-property-type-getall',
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

  propertyTypes: PropertyTypeResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private propertyTypeService: PropertyTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPropertyTypes();

    this.subscription.add(
      this.propertyTypeService.propertyTypes$.subscribe(types => {
        this.propertyTypes = types;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPropertyTypes(): void {
    this.loading = true;

    this.subscription.add(
      this.propertyTypeService.getAllPropertyTypes().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los tipos de propiedad'
          });
        }
      })
    );
  }

  confirmDelete(type: PropertyTypeResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el tipo "${type.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deletePropertyType(type.id!)
    });
  }

  deletePropertyType(id: number): void {
    this.subscription.add(
      this.propertyTypeService.deletePropertyType(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Tipo de propiedad eliminado correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el tipo de propiedad'
          });
        }
      })
    );
  }
}
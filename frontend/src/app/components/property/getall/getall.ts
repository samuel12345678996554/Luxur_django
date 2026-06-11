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

import { PropertyService } from '../../../services/property.service';
import { PropertyResponseI } from '../../../models/property';

@Component({
  selector: 'app-property-getall',
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

  properties: PropertyResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private propertyService: PropertyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProperties();

    this.subscription.add(
      this.propertyService.properties$.subscribe(props => {
        this.properties = props;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProperties(): void {
    this.loading = true;

    this.subscription.add(
      this.propertyService.getAllProperties().subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las propiedades'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(prop: PropertyResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar propiedad "${prop.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProperty(prop.id!)
    });
  }

  deleteProperty(id: number): void {
    this.subscription.add(
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Propiedad eliminada correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la propiedad'
          });
        }
      })
    );
  }
}
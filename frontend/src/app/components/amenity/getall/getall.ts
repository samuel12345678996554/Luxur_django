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

import { AmenityService } from '../../../services/amenity.service';
import { AmenityResponseI } from '../../../models/amenity';

@Component({
  selector: 'app-amenity-getall',
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
  amenities: AmenityResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private amenityService: AmenityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAmenities();

    this.subscription.add(
      this.amenityService.amenities$.subscribe(items => {
        this.amenities = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAmenities(): void {
    this.loading = true;

    this.subscription.add(
      this.amenityService.getAllAmenities().subscribe({
        next: () => this.loading = false,
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las amenidades'
          });
        }
      })
    );
  }

  confirmDelete(amenity: AmenityResponseI): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la amenidad "${amenity.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteAmenity(amenity.id!)
    });
  }

  deleteAmenity(id: number): void {
    this.subscription.add(
      this.amenityService.deleteAmenity(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Amenidad eliminada correctamente'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la amenidad'
          });
        }
      })
    );
  }
}
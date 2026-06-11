import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AmenityService } from '../../../services/amenity.service';

@Component({
  selector: 'app-amenity-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {

  amenity = {
    name: ''
  };

  loading = false;

  constructor(
    private amenityService: AmenityService,
    private router: Router,
    private messageService: MessageService
  ) {}

  save(): void {
    if (!this.amenity.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es obligatorio'
      });
      return;
    }

    this.loading = true;

    this.amenityService.createAmenity(this.amenity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Amenidad creada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/amenity']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la amenidad'
        });
      }
    });
  }
}


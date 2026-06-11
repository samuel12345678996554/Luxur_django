import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { PropertyTypeService } from '../../../services/property-type.service';

@Component({
  selector: 'app-property-type-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {

  propertyType = {
    name: ''
  };

  loading = false;

  constructor(
    private propertyTypeService: PropertyTypeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  save(): void {

    if (!this.propertyType.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es obligatorio'
      });
      return;
    }

    this.loading = true;

    this.propertyTypeService.createPropertyType(this.propertyType)
      .subscribe({
        next: () => {

          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Tipo de propiedad creado correctamente'
          });

          setTimeout(() => {
            this.router.navigate(['/property-type']);
          }, 1000);

        },
        error: () => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el tipo'
          });
        }
      });
  }
}
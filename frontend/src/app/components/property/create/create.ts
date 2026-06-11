import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-property-create',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, Select, ToastModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create {
  form: FormGroup;
  loading = false;
  statusOptions = [{label: 'Activo', value: 'ACTIVE'}, {label: 'Inactivo', value: 'INACTIVE'}];

  constructor(private fb: FormBuilder, private router: Router, private propertyService: PropertyService, private messageService: MessageService) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: [''],
      price: [null],
      area: [null],
      rooms: [null],
      owner: [null],
      status: ['ACTIVE', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      this.propertyService.createProperty(data).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Propiedad creada' });
          setTimeout(() => this.router.navigate(['/property']), 700);

        },
        error: (err) => {
          console.error('Error creating property:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la propiedad' });
          this.loading = false;
        }
      });
    } else {
      this.markAllTouched();
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Completa los campos obligatorios' });
    }
  }

  cancelar(): void {
    this.router.navigate(['/property']);

  }

  private markAllTouched(): void {
    Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched());
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { OwnerService } from '../../../services/owner.service';

@Component({
  selector: 'app-owner-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.ownerService.createOwner(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Propietario creado correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/owner']);
        }, 800);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el propietario'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/owner']);
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);

    if (control?.hasError('required') && control.touched) {
      return 'Este campo es obligatorio';
    }

    if (control?.hasError('email') && control.touched) {
      return 'Ingrese un correo válido';
    }

    return null;
  }
}
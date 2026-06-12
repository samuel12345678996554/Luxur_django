import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {

  form: FormGroup;
  loading = false;
  clientId = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageService
  ) {

    this.form = this.fb.group({
      cedula: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });

  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.clientId = parseInt(id);
      this.loadClient();
    }

  }

  loadClient(): void {

    this.loading = true;

    this.clientService.getClientById(this.clientId).subscribe({

      next: (client) => {

        this.form.patchValue({
          cedula: client.cedula,
          name: client.name,
          address: client.address,
          phone: client.phone,
          email: client.email
        });

        this.loading = false;
      },

      error: (error) => {

        console.error('Error loading client:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el cliente'
        });

        this.loading = false;
        this.router.navigate(['/client']);
      }

    });

  }

  submit(): void {

    if (this.form.valid) {

      this.loading = true;

      const clientData = { ...this.form.value };

      if (!clientData.password) {
        delete clientData.password;
      }

      this.clientService.updateClient(
        this.clientId,
        clientData
      ).subscribe({

        next: () => {

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente'
          });

          setTimeout(() => {
            this.router.navigate(['/client']);
          }, 1500);

        },

        error: (error) => {

          console.error('Error updating client:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error?.message ||
              'Error al actualizar el cliente'
          });

          this.loading = false;
        }

      });

    } else {

      this.markFormGroupTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });

    }

  }

  cancelar(): void {
    this.router.navigate(['/client']);
  }

  private markFormGroupTouched(): void {

    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

  }

  getFieldError(fieldName: string): string {

    const field = this.form.get(fieldName);

    if (field?.errors && field?.touched) {

      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }

      if (field.errors['email']) {
        return 'Email no válido';
      }

      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }

      if (field.errors['pattern']) {
        return 'Formato no válido';
      }

    }

    return '';
  }

}
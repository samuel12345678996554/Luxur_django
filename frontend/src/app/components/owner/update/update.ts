import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { OwnerService } from '../../../services/owner.service';

@Component({
  selector: 'app-owner-update',
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
  templateUrl: './update.html',
  styleUrls: ['./update.css']
})
export class Update implements OnInit {

  form: FormGroup;
  loading = false;
  ownerId!: number;

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.ownerId = Number(this.route.snapshot.paramMap.get('id'));

    this.ownerService.getOwnerById(this.ownerId).subscribe({
      next: (owner) => {
        this.form.patchValue({
          name: owner.name,
          contact: owner.contact,
          email: owner.email
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el propietario'
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.ownerService.updateOwner(this.ownerId, this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Propietario actualizado correctamente'
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
          detail: 'No se pudo actualizar el propietario'
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
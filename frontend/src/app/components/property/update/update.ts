import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-property-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css']
})
export class Update implements OnInit {

  propertyForm!: FormGroup;
  propertyId!: number;
  loading = false;

  statusOptions = [
    {
      label: 'Disponible',
      value: 'AVAILABLE'
    },
    {
      label: 'Alquilada',
      value: 'RENTED'
    },
    {
      label: 'Vendida',
      value: 'SOLD'
    },
    {
      label: 'En Mantenimiento',
      value: 'MAINTENANCE'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private service: PropertyService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.propertyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      price: [null],
      area: [null],
      rooms: [null],
      owner: [null],
      status: ['AVAILABLE', Validators.required]
    });

    this.loadProperty();
  }

  loadProperty(): void {

    this.service.getPropertyById(this.propertyId).subscribe({

      next: (data) => {

        console.log('Propiedad cargada:', data);

        this.propertyForm.patchValue({
          title: data.title,
          address: data.address,
          description: data.description,
          price: data.price,
          area: data.area,
          rooms: data.rooms,
          owner: data.owner,
          status: data.status
        });

      },

      error: (err) => {

        console.error('Error cargando propiedad:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la propiedad'
        });

      }

    });

  }

  submit(): void {

    if (this.propertyForm.invalid) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete todos los campos requeridos'
      });

      return;
    }

    this.loading = true;

    this.service.updateProperty(
      this.propertyId,
      this.propertyForm.value
    ).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Propiedad actualizada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/property']);
        }, 1000);

      },

      error: (err) => {

        console.error('Error actualizando:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la propiedad'
        });

        this.loading = false;

      }

    });

  }

  cancelar(): void {
    this.router.navigate(['/property']);
  }

}
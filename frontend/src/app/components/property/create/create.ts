import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PropertyService } from '../../../services/property.service';
import { PropertyTypeService } from '../../../services/property-type.service';
import { AmenityService } from '../../../services/amenity.service';

@Component({
  selector: 'app-property-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule,
    ToastModule
  ],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
  providers: [MessageService]
})
export class Create implements OnInit {

  form: FormGroup;
  loading = false;

  propertyTypes: any[] = [];
  amenities: any[] = [];

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
    private router: Router,
    private propertyService: PropertyService,
    private propertyTypeService: PropertyTypeService,
    private amenityService: AmenityService,
    private messageService: MessageService
  ) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],

      // OBLIGATORIO
      price: [null, Validators.required],

      // Valores por defecto
      area: [0],
      rooms: [0],

      owner: [null],

      property_type: [null],
      amenities: [[]],

      status: ['AVAILABLE', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadPropertyTypes();
    this.loadAmenities();
  }

  loadPropertyTypes(): void {

    this.propertyTypeService.getAllPropertyTypes().subscribe({

      next: (data) => {
        this.propertyTypes = data;
      },

      error: (err) => {
        console.error('Error loading property types', err);
      }

    });

  }

  loadAmenities(): void {

    this.amenityService.getAllAmenities().subscribe({

      next: (data) => {
        this.amenities = data;
      },

      error: (err) => {
        console.error('Error loading amenities', err);
      }

    });

  }

  submit(): void {

    if (this.form.invalid) {

      this.markAllTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Completa los campos obligatorios'
      });

      return;
    }

    this.loading = true;

    const propertyData = {
      ...this.form.value,

      area: this.form.value.area || 0,
      rooms: this.form.value.rooms || 0
    };

    console.log('DATOS ENVIADOS:');
    console.log(JSON.stringify(propertyData, null, 2));

    this.propertyService.createProperty(propertyData).subscribe({

      next: () => {

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Propiedad creada correctamente'
        });

        setTimeout(() => {
          this.router.navigate(['/property']);
        }, 1000);

      },

      error: (err) => {

        console.error('ERROR COMPLETO:', err);
        console.error('RESPUESTA BACKEND:', err.error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error Backend',
          detail: JSON.stringify(err.error)
        });

        this.loading = false;

      }

    });

  }

  cancelar(): void {
    this.router.navigate(['/property']);
  }

  private markAllTouched(): void {

    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

  }

}
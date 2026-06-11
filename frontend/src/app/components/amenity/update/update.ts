import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AmenityService } from '../../../services/amenity.service';
import { AmenityResponseI } from '../../../models/amenity';

@Component({
  selector: 'app-amenity-update',
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
  templateUrl: './update.html',
  styleUrls: ['./update.css']
})
export class Update implements OnInit {

  id!: number;

  amenity: AmenityResponseI = {
    id: 0,
    name: ''
  };

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private amenityService: AmenityService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.amenityService.getAmenityById(this.id).subscribe({
      next: (data) => {
        this.amenity = data;
      },
      error: () => {
        this.router.navigate(['/amenity']);
      }
    });
  }

  update(): void {
    if (!this.amenity.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El nombre es obligatorio'
      });
      return;
    }

    this.loading = true;

    this.amenityService.updateAmenity(this.id, this.amenity).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Amenidad actualizada correctamente'
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
          detail: 'No se pudo actualizar la amenidad'
        });
      }
    });
  }
}
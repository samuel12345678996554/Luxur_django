import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PropertyTypeResponseI } from '../../../models/property-type';
import { PropertyTypeService } from '../../../services/property-type.service';

@Component({
  selector: 'app-property-type-update',
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

 propertyType: PropertyTypeResponseI = {
  id: 0,
  name: ''
};

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyTypeService: PropertyTypeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.propertyTypeService.getPropertyTypeById(this.id)
      .subscribe({
        next: (data) => {
          this.propertyType = data;
        },
        error: () => {
          this.router.navigate(['/property-type']);
        }
      });
  }

  update(): void {

    this.loading = true;

    this.propertyTypeService
      .updatePropertyType(this.id, this.propertyType)
      .subscribe({
        next: () => {

          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Tipo de propiedad actualizado correctamente'
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
            detail: 'No se pudo actualizar'
          });
        }
      });
  }
}
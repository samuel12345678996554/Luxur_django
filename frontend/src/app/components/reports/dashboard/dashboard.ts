import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientService } from '../../../services/client.service';
import { PropertyService } from '../../../services/property.service';
import { ContractService } from '../../../services/contract';
import { PaymentService } from '../../../services/payment.service';
import { VisitService } from '../../../services/visit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  stats = [
    // RESUMEN GENERAL

    {
      title: 'Clientes',
      value: 0,
      icon: 'pi pi-users',
      color: 'bg-blue-500'
    },
    {
      title: 'Propiedades',
      value: 0,
      icon: 'pi pi-building',
      color: 'bg-green-500'
    },
    {
      title: 'Contratos',
      value: 0,
      icon: 'pi pi-file',
      color: 'bg-orange-500'
    },
    {
      title: 'Pagos',
      value: 0,
      icon: 'pi pi-dollar',
      color: 'bg-purple-500'
    },
    {
      title: 'Visitas',
      value: 0,
      icon: 'pi pi-calendar',
      color: 'bg-cyan-500'
    },

    // INDICADORES INMOBILIARIOS

    {
      title: 'Disponibles',
      value: 0,
      icon: 'pi pi-home',
      color: 'bg-emerald-500'
    },
    {
      title: 'Alquiladas',
      value: 0,
      icon: 'pi pi-key',
      color: 'bg-blue-600'
    },
    {
      title: 'Vendidas',
      value: 0,
      icon: 'pi pi-check-circle',
      color: 'bg-indigo-600'
    },
    {
      title: 'Pendientes',
      value: 0,
      icon: 'pi pi-clock',
      color: 'bg-yellow-500'
    },
    {
      title: 'Ingresos',
      value: 0,
      icon: 'pi pi-wallet',
      color: 'bg-green-700'
    }
  ];

  constructor(
    private clientService: ClientService,
    private propertyService: PropertyService,
    private contractService: ContractService,
    private paymentService: PaymentService,
    private visitService: VisitService
  ) {}

  ngOnInit(): void {

    // CLIENTES

    this.clientService.getAllClients().subscribe(clients => {
      this.stats[0].value = clients.length;
    });

    // PROPIEDADES

    this.propertyService.getAllProperties().subscribe(properties => {

      this.stats[1].value = properties.length;

      // Disponibles

      this.stats[5].value =
        properties.filter(
          p => p.status === 'AVAILABLE'
        ).length;

      // Alquiladas

      this.stats[6].value =
        properties.filter(
          p => p.status === 'RENTED'
        ).length;

      // Vendidas

      this.stats[7].value =
        properties.filter(
          p => p.status === 'SOLD'
        ).length;

    });

    // CONTRATOS

    this.contractService.getAllContracts().subscribe(
      (contracts: any[]) => {
        this.stats[2].value = contracts.length;
      }
    );

    // PAGOS

    this.paymentService.getAllPayments().subscribe(payments => {

      this.stats[3].value = payments.length;

      const totalIngresos = payments.reduce(
        (total: number, payment: any) =>
          total + Number(payment.amount),
        0
      );

      this.stats[9].value = totalIngresos;

    });

    // VISITAS

    this.visitService.getAllVisits().subscribe((visits: any[]) => {

      this.stats[4].value = visits.length;

      this.stats[8].value =
        visits.filter(
          v => v.status === 'PENDING'
        ).length;

    });

  }

}
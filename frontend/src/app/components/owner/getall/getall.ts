import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { Subscription } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ContractService } from '../../../services/contract';
import { ContractResponseI } from '../../../models/contract';

@Component({
  selector: 'app-owner-getall',
  standalone: true,
  imports: [
  CommonModule,
  RouterModule,
  TableModule,
  ButtonModule,
  ToastModule,
  TooltipModule,
  InputTextModule,
  TagModule
],
  providers: [MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css']
})
export class Getall implements OnInit, OnDestroy {

  contracts: ContractResponseI[] = [];
  loading = false;

  private subscription = new Subscription();

  constructor(
    private contractService: ContractService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadContracts();

    this.subscription.add(
      this.contractService.contracts$.subscribe(contracts => {
        this.contracts = contracts;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadContracts(): void {
    this.loading = true;

    this.subscription.add(
      this.contractService.getAllContracts().subscribe({
        next: (contracts) => {
          this.contracts = contracts;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);

          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las propiedades asignadas'
          });
        }
      })
    );
  }
}
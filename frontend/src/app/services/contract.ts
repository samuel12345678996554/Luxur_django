import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContractI, ContractResponseI } from '../models/contract';

// Interfaz para la respuesta paginada de Django
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = 'http://localhost:8000/api/contracts';
  private contractsSubject = new BehaviorSubject<ContractResponseI[]>([]);
  public contracts$ = this.contractsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<ContractResponseI[]> {
    return this.http.get<PaginatedResponse<ContractResponseI>>(`${this.baseUrl}/`)
      .pipe(
        map(response => response.results),
        tap(contracts => {
          console.log('Fetched contracts:', contracts);
          this.contractsSubject.next(contracts);
        }),
        catchError(error => {
          console.error('Error fetching contracts:', error);
          return throwError(() => error);
        })
      );
  }

  getContractById(id: number): Observable<ContractResponseI> {
    return this.http.get<ContractResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching contract:', error);
          return throwError(() => error);
        })
      );
  }

  createContract(contract: ContractI): Observable<ContractResponseI> {
    return this.http.post<ContractResponseI>(`${this.baseUrl}/`, contract)
      .pipe(
        tap(response => {
          console.log('Contract created:', response);
          this.refreshContracts();
        }),
        catchError(error => {
          console.error('Error creating contract:', error);
          return throwError(() => error);
        })
      );
  }

  updateContract(id: number, contract: Partial<ContractI>): Observable<ContractResponseI> {
    return this.http.put<ContractResponseI>(`${this.baseUrl}/${id}/`, contract)
      .pipe(
        tap(response => {
          console.log('Contract updated:', response);
          this.refreshContracts();
        }),
        catchError(error => {
          console.error('Error updating contract:', error);
          return throwError(() => error);
        })
      );
  }

  partialUpdateContract(id: number, contract: Partial<ContractI>): Observable<ContractResponseI> {
    return this.http.patch<ContractResponseI>(`${this.baseUrl}/${id}/`, contract)
      .pipe(
        tap(response => {
          console.log('Contract partially updated:', response);
          this.refreshContracts();
        }),
        catchError(error => {
          console.error('Error partially updating contract:', error);
          return throwError(() => error);
        })
      );
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('Contract deleted:', id);
          this.refreshContracts();
        }),
        catchError(error => {
          console.error('Error deleting contract:', error);
          return throwError(() => error);
        })
      );
  }

  updateLocalContracts(contracts: ContractResponseI[]): void {
    this.contractsSubject.next(contracts);
  }

  refreshContracts(): void {
    this.getAllContracts().subscribe({
      next: (contracts) => {
        this.contractsSubject.next(contracts);
      },
      error: (error) => {
        console.error('Error refreshing contracts:', error);
      }
    });
  }
}
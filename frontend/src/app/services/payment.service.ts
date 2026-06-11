import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { PaymentI, PaymentResponseI } from '../models/payment';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PaymentResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api/payments/';

  private paymentsSubject = new BehaviorSubject<PaymentResponseI[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<PaymentResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(payments => this.paymentsSubject.next(payments)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getPaymentById(id: number): Observable<PaymentResponseI> {
    return this.http.get<PaymentResponseI>(`${this.apiUrl}${id}/`);
  }

  createPayment(payment: PaymentI): Observable<PaymentResponseI> {
    return this.http.post<PaymentResponseI>(this.apiUrl, payment).pipe(
      tap(() => this.getAllPayments().subscribe())
    );
  }

  updatePayment(id: number, payment: PaymentI): Observable<PaymentResponseI> {
    return this.http.put<PaymentResponseI>(`${this.apiUrl}${id}/`, payment).pipe(
      tap(() => this.getAllPayments().subscribe())
    );
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.getAllPayments().subscribe())
    );
  }
}
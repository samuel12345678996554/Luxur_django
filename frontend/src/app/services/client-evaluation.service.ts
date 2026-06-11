import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import {
  ClientEvaluationI,
  ClientEvaluationResponseI
} from '../models/client-evaluation';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientEvaluationResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientEvaluationService {

  private apiUrl =
    'http://localhost:8000/api/client-evaluations/';

  private evaluationsSubject =
    new BehaviorSubject<ClientEvaluationResponseI[]>([]);

  public evaluations$ =
    this.evaluationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllEvaluations(): Observable<ClientEvaluationResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(items => this.evaluationsSubject.next(items)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getEvaluationById(
    id: number
  ): Observable<ClientEvaluationResponseI> {
    return this.http.get<ClientEvaluationResponseI>(
      `${this.apiUrl}${id}/`
    );
  }

  createEvaluation(
    evaluation: ClientEvaluationI
  ): Observable<ClientEvaluationResponseI> {
    return this.http.post<ClientEvaluationResponseI>(
      this.apiUrl,
      evaluation
    ).pipe(
      tap(() => this.getAllEvaluations().subscribe())
    );
  }

  updateEvaluation(
    id: number,
    evaluation: ClientEvaluationI
  ): Observable<ClientEvaluationResponseI> {
    return this.http.put<ClientEvaluationResponseI>(
      `${this.apiUrl}${id}/`,
      evaluation
    ).pipe(
      tap(() => this.getAllEvaluations().subscribe())
    );
  }

  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`
    ).pipe(
      tap(() => this.getAllEvaluations().subscribe())
    );
  }
}
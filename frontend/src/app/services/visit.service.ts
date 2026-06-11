import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { VisitI, VisitResponseI } from '../models/visit';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VisitResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private apiUrl = 'http://localhost:8000/api/visits/';

  private visitsSubject =
    new BehaviorSubject<VisitResponseI[]>([]);

  public visits$ =
    this.visitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllVisits(): Observable<VisitResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(visits => this.visitsSubject.next(visits)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getVisitById(id: number): Observable<VisitResponseI> {
    return this.http.get<VisitResponseI>(
      `${this.apiUrl}${id}/`
    );
  }

  createVisit(
    visit: VisitI
  ): Observable<VisitResponseI> {
    return this.http.post<VisitResponseI>(
      this.apiUrl,
      visit
    ).pipe(
      tap(() => this.getAllVisits().subscribe())
    );
  }

  updateVisit(
    id: number,
    visit: VisitI
  ): Observable<VisitResponseI> {
    return this.http.put<VisitResponseI>(
      `${this.apiUrl}${id}/`,
      visit
    ).pipe(
      tap(() => this.getAllVisits().subscribe())
    );
  }

  deleteVisit(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`
    ).pipe(
      tap(() => this.getAllVisits().subscribe())
    );
  }
}
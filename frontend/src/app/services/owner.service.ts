import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { OwnerI, OwnerResponseI } from '../models/owner';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OwnerResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = 'http://localhost:8000/api/owners/';

  private ownersSubject = new BehaviorSubject<OwnerResponseI[]>([]);
  public owners$ = this.ownersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllOwners(): Observable<OwnerResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(owners => {
        this.ownersSubject.next(owners);
      }),
      catchError(error => {
        console.error('Error al obtener propietarios:', error);
        return of([]);
      })
    );
  }

  getOwnerById(id: number): Observable<OwnerResponseI> {
    return this.http.get<OwnerResponseI>(`${this.apiUrl}${id}/`);
  }

  createOwner(owner: OwnerI): Observable<OwnerResponseI> {
    return this.http.post<OwnerResponseI>(this.apiUrl, owner).pipe(
      tap(() => this.getAllOwners().subscribe())
    );
  }

  updateOwner(id: number, owner: OwnerI): Observable<OwnerResponseI> {
    return this.http.put<OwnerResponseI>(`${this.apiUrl}${id}/`, owner).pipe(
      tap(() => this.getAllOwners().subscribe())
    );
  }

  deleteOwner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.getAllOwners().subscribe())
    );
  }
}
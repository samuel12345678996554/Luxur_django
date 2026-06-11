import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import {
  PropertyTypeI,
  PropertyTypeResponseI
} from '../models/property-type';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyTypeResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class PropertyTypeService {

  private apiUrl = 'http://localhost:8000/api/property-types/';

  private propertyTypesSubject =
    new BehaviorSubject<PropertyTypeResponseI[]>([]);

  public propertyTypes$ =
    this.propertyTypesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPropertyTypes(): Observable<PropertyTypeResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(types => this.propertyTypesSubject.next(types)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getPropertyTypeById(id: number): Observable<PropertyTypeResponseI> {
    return this.http.get<PropertyTypeResponseI>(
      `${this.apiUrl}${id}/`
    );
  }

  createPropertyType(
    type: PropertyTypeI
  ): Observable<PropertyTypeResponseI> {
    return this.http.post<PropertyTypeResponseI>(
      this.apiUrl,
      type
    ).pipe(
      tap(() => this.getAllPropertyTypes().subscribe())
    );
  }

  updatePropertyType(
    id: number,
    type: PropertyTypeI
  ): Observable<PropertyTypeResponseI> {
    return this.http.put<PropertyTypeResponseI>(
      `${this.apiUrl}${id}/`,
      type
    ).pipe(
      tap(() => this.getAllPropertyTypes().subscribe())
    );
  }

  deletePropertyType(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`
    ).pipe(
      tap(() => this.getAllPropertyTypes().subscribe())
    );
  }
}
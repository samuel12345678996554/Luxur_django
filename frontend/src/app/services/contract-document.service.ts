import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import {
  ContractDocumentI,
  ContractDocumentResponseI
} from '../models/contract-document';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContractDocumentResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class ContractDocumentService {

  private apiUrl =
    'http://localhost:8000/api/contract-documents/';

  private documentsSubject =
    new BehaviorSubject<ContractDocumentResponseI[]>([]);

  public documents$ =
    this.documentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<ContractDocumentResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(items => this.documentsSubject.next(items)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getDocumentById(
    id: number
  ): Observable<ContractDocumentResponseI> {
    return this.http.get<ContractDocumentResponseI>(
      `${this.apiUrl}${id}/`
    );
  }

  createDocument(formData: FormData): Observable<any> {
    return this.http.post(
      this.apiUrl,
      formData
    ).pipe(
      tap(() => this.getAllDocuments().subscribe())
    );
  }

  updateDocument(
    id: number,
    formData: FormData
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}${id}/`,
      formData
    ).pipe(
      tap(() => this.getAllDocuments().subscribe())
    );
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}/`
    ).pipe(
      tap(() => this.getAllDocuments().subscribe())
    );
  }
}
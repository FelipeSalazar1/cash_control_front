import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category, Expense } from '../models/expense.model';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

@Injectable({
  providedIn: 'root'
}) 
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}`;

  findAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.baseUrl);
  }

  findByCategory(category: Category): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${category}`);
  }

  create(payload: Omit<Expense, 'id' | 'date'>): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, payload);
  }

  update(id: string, payload: Omit<Expense, 'id' | 'date'>): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


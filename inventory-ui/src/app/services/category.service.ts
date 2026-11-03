import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'http://localhost:8088';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all categories: GET /showAllCategories
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/showAllCategories`);
  }

  /**
   * Adds a new category: POST /addProductCategory
   */
  addCategory(category: { name: string; description?: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/addProductCategory`, category, {
      responseType: 'text'
    });
  }
}

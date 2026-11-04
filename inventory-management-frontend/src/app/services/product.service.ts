import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8088';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all products: GET /viewProducts
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/viewProducts`);
  }

  /**
   * Adds a new product: POST /addProduct
   */
  addProduct(product: Partial<Product>): Observable<string> {
    return this.http.post(`${this.baseUrl}/addProduct`, product, {
      responseType: 'text'
    });
  }

  /**
   * Updates an existing product: PUT /updateProduct/{id}
   */
  updateProduct(id: number, product: Partial<Product>): Observable<string> {
    return this.http.put(`${this.baseUrl}/updateProduct/${id}`, product, {
      responseType: 'text'
    });
  }

  /**
   * Deletes a product: DELETE /deleteProduct/{id}
   */
  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/deleteProduct/${id}`, {
      responseType: 'text'
    });
  }

  /**
   * Searches products by keyword (name or SKU): GET /searchProduct?keyword={keyword}
   */
  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(`${this.baseUrl}/searchProduct`, { params });
  }

  /**
   * Filters products by category ID: GET /findByCategoryId/{categoryId}
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/findByCategoryId/${categoryId}`);
  }

  /**
   * Gets low stock products below threshold: GET /lowStockProducts?threshhold={threshold}
   */
  getLowStockProducts(threshold: number = 10): Observable<Product[]> {
    const params = new HttpParams().set('threshhold', threshold.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/lowStockProducts`, { params });
  }

  /**
   * Quick update of product stock quantity: PATCH /updateStockQuant/{id}?quantity={quantity}
   */
  updateStockQuantity(id: number, quantity: number): Observable<string> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.patch(`${this.baseUrl}/updateStockQuant/${id}`, null, {
      params,
      responseType: 'text'
    });
  }
}

import { Category } from './category.model';

export interface Product {
  id?: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category?: Category | null;
  created_at?: string;
  updated_at?: string;
}

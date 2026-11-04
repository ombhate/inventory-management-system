import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Main Data
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successToast = '';

  // Filter & Search state
  searchKeyword = '';
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  selectedCategoryId: number | 'ALL' = 'ALL';
  isLowStockOnly = false;
  lowStockThreshold = 10;

  // Add Product Modal
  showAddModal = false;
  newProduct: {
    name: string;
    sku: string;
    price: number | null;
    quantity: number | null;
    categoryId: number | null;
  } = {
    name: '',
    sku: '',
    price: null,
    quantity: null,
    categoryId: null
  };

  // Edit Product Modal
  showEditModal = false;
  editingProductId: number | null = null;
  editProductData: {
    name: string;
    sku: string;
    price: number | null;
    quantity: number | null;
    categoryId: number | null;
  } = {
    name: '',
    sku: '',
    price: null,
    quantity: null,
    categoryId: null
  };

  // Delete Confirmation Modal
  showDeleteModal = false;
  productToDelete: Product | null = null;

  // Add Category Modal
  showAddCategoryModal = false;
  newCategory = {
    name: '',
    description: ''
  };

  // Quick Stock Adjust Modal
  showQuickStockModal = false;
  productToAdjustStock: Product | null = null;
  newStockQuantity: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.setupRealTimeSearch();
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  /**
   * Sets up real-time search with debounce (GET /searchProduct?keyword=...)
   */
  private setupRealTimeSearch(): void {
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe((keyword: string) => {
        this.performSearch(keyword.trim());
      });
  }

  onSearchChange(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  /**
   * Loads all categories via GET /showAllCategories
   */
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (cats: Category[]) => {
        this.categories = cats || [];
      },
      error: (err) => {
        console.warn('Failed to load categories:', err);
      }
    });
  }

  /**
   * Loads all products via GET /viewProducts
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.isLowStockOnly = false;
    this.selectedCategoryId = 'ALL';

    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching products:', err);
        if (err.status === 0) {
          this.errorMessage = 'Could not connect to backend server at http://localhost:8088. Please verify Spring Boot is running.';
        } else {
          this.errorMessage = 'Failed to load products from server.';
        }
      }
    });
  }

  /**
   * Real-time search: calls GET /searchProduct?keyword={keyword}
   */
  performSearch(keyword: string): void {
    if (!keyword) {
      // If keyword cleared, reload based on category filter or all
      if (this.selectedCategoryId !== 'ALL') {
        this.onCategoryFilterChange();
      } else if (this.isLowStockOnly) {
        this.filterLowStock();
      } else {
        this.loadProducts();
      }
      return;
    }

    this.isLoading = true;
    this.isLowStockOnly = false;
    this.selectedCategoryId = 'ALL';

    this.productService.searchProducts(keyword).subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Search failed:', err);
        this.errorMessage = 'Search query failed. Please try again.';
      }
    });
  }

  /**
   * Category Filter: calls GET /findByCategoryId/{id} or GET /viewProducts
   */
  onCategoryFilterChange(): void {
    this.searchKeyword = '';
    this.isLowStockOnly = false;

    if (this.selectedCategoryId === 'ALL') {
      this.loadProducts();
      return;
    }

    this.isLoading = true;
    this.productService.getProductsByCategory(Number(this.selectedCategoryId)).subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Category filter failed:', err);
        this.errorMessage = 'Failed to filter by category.';
      }
    });
  }

  /**
   * Low Stock Filter: calls GET /lowStockProducts?threshhold=10
   */
  filterLowStock(): void {
    this.searchKeyword = '';
    this.selectedCategoryId = 'ALL';
    this.isLowStockOnly = true;
    this.isLoading = true;

    this.productService.getLowStockProducts(this.lowStockThreshold).subscribe({
      next: (data: Product[]) => {
        this.products = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Low stock query failed:', err);
        this.errorMessage = 'Failed to fetch low stock products.';
      }
    });
  }

  /**
   * Resets all search and filters
   */
  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategoryId = 'ALL';
    this.isLowStockOnly = false;
    this.loadProducts();
  }

  // --- CRUD: ADD PRODUCT ---
  openAddModal(): void {
    this.newProduct = {
      name: '',
      sku: '',
      price: null,
      quantity: null,
      categoryId: this.categories.length > 0 ? this.categories[0].id : null
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveNewProduct(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    const payload: Partial<Product> = {
      name: this.newProduct.name.trim(),
      sku: this.newProduct.sku.trim(),
      price: Number(this.newProduct.price),
      quantity: Number(this.newProduct.quantity)
    };

    if (this.newProduct.categoryId) {
      const selectedCat = this.categories.find(c => c.id === Number(this.newProduct.categoryId));
      if (selectedCat) {
        payload.category = selectedCat;
      }
    }

    this.isLoading = true;
    this.productService.addProduct(payload).subscribe({
      next: (res: string) => {
        this.isLoading = false;
        this.closeAddModal();
        this.showToast(res || 'Product added successfully!');
        this.refreshCurrentView();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Add product failed:', err);
        alert(err.error || 'Failed to add product. Please check input values.');
      }
    });
  }

  // --- CRUD: UPDATE PRODUCT ---
  openEditModal(product: Product): void {
    if (!product.id) return;
    this.editingProductId = product.id;
    this.editProductData = {
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category?.id || (this.categories.length > 0 ? this.categories[0].id : null)
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingProductId = null;
  }

  saveUpdatedProduct(form: NgForm): void {
    if (!this.editingProductId || form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    const payload: Partial<Product> = {
      id: this.editingProductId,
      name: this.editProductData.name.trim(),
      sku: this.editProductData.sku.trim(),
      price: Number(this.editProductData.price),
      quantity: Number(this.editProductData.quantity)
    };

    if (this.editProductData.categoryId) {
      const selectedCat = this.categories.find(c => c.id === Number(this.editProductData.categoryId));
      if (selectedCat) {
        payload.category = selectedCat;
      }
    }

    this.isLoading = true;
    this.productService.updateProduct(this.editingProductId, payload).subscribe({
      next: (res: string) => {
        this.isLoading = false;
        this.closeEditModal();
        this.showToast(res || 'Product updated successfully!');
        this.refreshCurrentView();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Update product failed:', err);
        alert(err.error || 'Failed to update product.');
      }
    });
  }

  // --- CRUD: DELETE PRODUCT ---
  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  executeDelete(): void {
    if (!this.productToDelete || !this.productToDelete.id) return;

    const id = this.productToDelete.id;
    this.isLoading = true;
    this.productService.deleteProduct(id).subscribe({
      next: (res: string) => {
        this.isLoading = false;
        this.closeDeleteModal();
        this.showToast(res || 'Product deleted successfully!');
        this.refreshCurrentView();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Delete product failed:', err);
        alert(err.error || 'Failed to delete product.');
      }
    });
  }

  // --- QUICK STOCK QUANTITY ADJUST (PATCH /updateStockQuant/{id}?quantity=...) ---
  openQuickStock(product: Product): void {
    this.productToAdjustStock = product;
    this.newStockQuantity = product.quantity;
    this.showQuickStockModal = true;
  }

  closeQuickStockModal(): void {
    this.showQuickStockModal = false;
    this.productToAdjustStock = null;
  }

  saveStockAdjustment(): void {
    if (!this.productToAdjustStock || !this.productToAdjustStock.id) return;
    if (this.newStockQuantity < 0) {
      alert('Stock quantity cannot be negative.');
      return;
    }

    this.isLoading = true;
    this.productService.updateStockQuantity(this.productToAdjustStock.id, this.newStockQuantity).subscribe({
      next: (res: string) => {
        this.isLoading = false;
        this.closeQuickStockModal();
        this.showToast(res || 'Stock quantity updated successfully!');
        this.refreshCurrentView();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Quick stock update failed:', err);
        alert(err.error || 'Failed to update stock quantity.');
      }
    });
  }

  // --- DYNAMIC CATEGORY CREATION (POST /addProductCategory) ---
  openAddCategoryModal(): void {
    this.newCategory = { name: '', description: '' };
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal(): void {
    this.showAddCategoryModal = false;
  }

  saveNewCategory(form: NgForm): void {
    if (form.invalid) return;

    this.categoryService.addCategory(this.newCategory).subscribe({
      next: (res: string) => {
        this.closeAddCategoryModal();
        this.showToast(res || 'Category added successfully!');
        this.loadCategories();
      },
      error: (err) => {
        console.error('Add category failed:', err);
        alert(err.error || 'Failed to create category.');
      }
    });
  }

  // --- HELPER CALCULATIONS & VIEW UPDATES ---
  refreshCurrentView(): void {
    if (this.isLowStockOnly) {
      this.filterLowStock();
    } else if (this.selectedCategoryId !== 'ALL') {
      this.onCategoryFilterChange();
    } else if (this.searchKeyword.trim()) {
      this.performSearch(this.searchKeyword.trim());
    } else {
      this.loadProducts();
    }
  }

  get totalInventoryValue(): number {
    return this.products.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 0), 0);
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.quantity > 0 && p.quantity <= this.lowStockThreshold).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.quantity === 0).length;
  }

  showToast(message: string): void {
    this.successToast = message;
    setTimeout(() => {
      this.successToast = '';
    }, 3500);
  }

logout(): void {
    // Shows a confirmation box with OK and Cancel
    const confirmed = window.confirm('Are you sure you want to log out?');

    if (confirmed) {
      // This runs ONLY if you click "OK"
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    // If you click "Cancel", nothing happens and you stay on the page!
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login - Inventory Management' },
  { path: 'register', component: RegisterComponent, title: 'Register - Inventory Management' },
  { path: 'signup', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
    title: 'Product Dashboard - Inventory Management'
  },
  { path: '**', redirectTo: 'login' }
];

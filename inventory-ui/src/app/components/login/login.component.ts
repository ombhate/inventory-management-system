import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  showPassword = false;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  returnUrl = '/products';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const returnUrlParam = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrlParam) {
      this.returnUrl = returnUrlParam;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response: string) => {
        this.isLoading = false;
        if (response && response.toLowerCase().includes('success')) {
          this.successMessage = 'Login successful! Redirecting to products...';
          setTimeout(() => {
            this.router.navigateByUrl(this.returnUrl);
          }, 600);
        } else {
          // Backend returned: "invalid username and password"
          this.errorMessage = response || 'Invalid email or password. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Unable to connect to backend server at http://localhost:8088. Please verify Spring Boot is running.';
        } else {
          this.errorMessage = err.error || 'Login failed. Please verify your credentials and try again.';
        }
      }
    });
  }
}

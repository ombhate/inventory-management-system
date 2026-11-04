import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  };

  confirmPassword = '';
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  roles: string[] = ['ADMIN', 'MANAGER', 'STAFF', 'USER'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onRegister(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.user).subscribe({
      next: (response: string) => {
        this.isLoading = false;
        // Backend returns "User registered successully"
        this.successMessage = response || 'Registration successful! You can now log in.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Unable to connect to backend server at http://localhost:8088. Please verify Spring Boot is running.';
        } else {
          this.errorMessage = err.error || 'Registration failed. Please try again.';
        }
      }
    });
  }
}

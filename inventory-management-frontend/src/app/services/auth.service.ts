import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8088';
  private readonly USER_STORAGE_KEY = 'inventory_user_session';

  constructor(private http: HttpClient) {}

  /**
   * Registers a new user with Spring Boot backend: POST /register
   * Returns a plain text response: "User registered successully"
   */
  register(user: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, user, {
      responseType: 'text'
    });
  }

  /**
   * Logs in a user with Spring Boot backend: POST /login
   * Returns a plain text response: "login successfully" or "invalid username and password"
   */
  login(credentials: LoginRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      responseType: 'text'
    }).pipe(
      tap((response: string) => {
        if (response && response.toLowerCase().includes('success')) {
          const sessionUser = {
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'USER',
            loginTime: new Date().toISOString()
          };
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(sessionUser));
        }
      })
    );
  }

  /**
   * Checks if user is currently logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_STORAGE_KEY);
  }

  /**
   * Returns current session user
   */
  getCurrentUser(): { email: string; name: string; role: string } | null {
    const raw = localStorage.getItem(this.USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Clears session and logs out
   */
  logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { LoginRequest, LoginResponse, AuthData } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  private readonly AUTH_DATA_KEY = 'auth_data';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const authData = this.getAuthDataFromStorage();
    const user = authData?.user || null;
    const isAuth = this.isTokenValid(authData);

    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(isAuth);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    if (authData && !isAuth) {
      this.clearAuthData();
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get currentToken(): string | null {
    const authData = this.getAuthDataFromStorage();
    return authData?.token || null;
  }

  loginMock(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔄 Intentando login MOCK con:', credentials);

    return of(null).pipe(
      delay(1000),
      map(() => {
        let role: 'admin' | 'seller' | 'buyer' = 'buyer';
        let name = 'Usuario';
        
        if (credentials.username.includes('admin')) {
          role = 'admin';
          name = 'Administrador';
        } else if (credentials.username.includes('seller') || credentials.username.includes('vendedor')) {
          role = 'seller';
          name = 'Vendedor';
        } else {
          role = 'buyer';
          name = 'Comprador';
        }

        const response: LoginResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now().toString(),
            email: credentials.username,
            name: name,
            role: role,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
          },
          expiresIn: 3600 
        };
        
        console.log('✅ Login MOCK exitoso con cualquier credencial:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error en login MOCK:', error);
        return throwError(() => error);
      })
    );
  }

  loginReal(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔄 Intentando login REAL con:', credentials.username);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => console.log('✅ Login REAL exitoso:', response)),
      catchError(error => {
        console.error('❌ Error en login REAL:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<User> {
    // 🔴 CAMBIAR AQUÍ: usa loginReal() cuando tengas backend
    return this.loginMock(credentials).pipe(
      tap(response => {
        this.setAuthData(response);
        
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
        
        console.log('✅ Usuario autenticado:', response.user);
      }),
      map(response => response.user)
    );
  }

  logout(): void {
    console.log('👋 Cerrando sesión...');
    
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/auth/login']);
    
    console.log('✅ Sesión cerrada');
  }

  isAuthenticated(): boolean {
    const authData = this.getAuthDataFromStorage();
    return this.isTokenValid(authData);
  }

  private setAuthData(response: LoginResponse): void {
    const expiresAt = Date.now() + (response.expiresIn * 1000);
    const authData: AuthData = {
      token: response.token,
      user: response.user,
      expiresAt
    };
    localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));
    console.log('💾 Auth data guardado, expira en:', new Date(expiresAt));
  }

  private getAuthDataFromStorage(): AuthData | null {
    const data = localStorage.getItem(this.AUTH_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_DATA_KEY);
  }

  private isTokenValid(authData: AuthData | null): boolean {
    if (!authData || !authData.token) {
      return false;
    }
    
    const now = Date.now();
    const isValid = now < authData.expiresAt;
    
    if (!isValid) {
      console.log('⏰ Token expirado');
    }
    
    return isValid;
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  private determineRole(email: string): 'admin' | 'seller' | 'buyer' {
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail === 'admin@tienda.com') {
      return 'admin';
    } else if (lowerEmail === 'seller@tienda.com' || lowerEmail.includes('vendedor')) {
      return 'seller';
    } else {
      return 'buyer';
    }
  }

  loginMock(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('🔄 Intentando login MOCK con:', credentials);

    return of(null).pipe(
      delay(1000),
      map(() => {
        const role = this.determineRole(credentials.username);
        
        let name = 'Usuario';
        let avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;

        if (role === 'admin') {
          name = 'Administrador Principal';
          avatar = 'https://i.pravatar.cc/150?img=12'; // Avatar específico
        } else if (role === 'seller') {
          name = 'Vendedor TechStore';
          avatar = 'https://i.pravatar.cc/150?img=33'; // Avatar específico
        } else {
          name = credentials.username.split('@')[0];
        }

        const response: LoginResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now().toString(),
            email: credentials.username,
            name: name,
            role: role,
            avatar: avatar
          },
          expiresIn: 3600 
        };
        
        console.log('✅ Login MOCK exitoso:', response);
        console.log('👤 Rol asignado:', role);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error en login MOCK:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.loginMock(credentials).pipe(
      tap(response => {
        this.setAuthData(response);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
        console.log('✅ Usuario autenticado:', response.user);
        console.log('🎭 Rol:', response.user.role);
      }),
      map(response => response.user)
    );
  }

  redirectToDashboard(): void {
    const user = this.currentUserValue;
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    console.log('🔀 Redirigiendo según rol:', user.role);

    switch (user.role) {
      case 'admin':
        console.log('→ Redirigiendo a /admin/dashboard');
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'seller':
        console.log('→ Redirigiendo a /seller/dashboard');
        this.router.navigate(['/seller/dashboard']);
        break;
      case 'buyer':
      default:
        console.log('→ Redirigiendo a /products');
        this.router.navigate(['/products']);
        break;
    }
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    console.log('📧 Solicitud de recuperación MOCK para:', email);

    return of(null).pipe(
      delay(1500),
      map(() => {
        const resetToken = 'reset-token-' + Date.now();
        console.log('✅ Token de recuperación generado:', resetToken);
        
        return {
          message: `Se ha enviado un correo a ${email} con instrucciones para recuperar tu contraseña.`
        };
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    console.log('🔑 Reset password MOCK con token:', token);

    return of(null).pipe(
      delay(1000),
      map(() => {
        console.log('✅ Contraseña cambiada exitosamente');
        return {
          message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.'
        };
      })
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
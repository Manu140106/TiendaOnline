import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.currentToken;

    if (token && this.isApiUrl(request.url)) {
      console.log('🔐 JWT Interceptor: Agregando token a la petición');
      console.log('📍 URL:', request.url);
      
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }

  private isApiUrl(url: string): boolean {
    return url.includes('api/') || url.includes('localhost:8080') || url.includes('localhost:3000');
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('🔐 AuthGuard: Verificando autenticación...');
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ AuthGuard: Usuario autenticado, acceso permitido');
      return true;
    }

    console.log('❌ AuthGuard: Usuario NO autenticado, redirigiendo al login');
    console.log('📍 Intentaba acceder a:', state.url);
    
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
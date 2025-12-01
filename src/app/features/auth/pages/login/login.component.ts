import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    console.log('🚀 Botón Ingresar presionado');
    
    if (this.loginForm.invalid) {
      console.log('❌ Formulario inválido');
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;
    console.log('📧 Intentando login con:', credentials.username);

    this.authService.login(credentials).subscribe({
      next: (user) => {
        console.log('✅ Login exitoso, usuario:', user);
        this.isLoading = false;
        
        this.authService.redirectToDashboard();
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Email o contraseña incorrectos';
      }
    });
  }

  onForgotPassword(): void {
    console.log('🔗 Link "Olvidaste tu contraseña" presionado');
    this.router.navigate(['/auth/forgot-password']);
  }

  quickLogin(role: 'admin' | 'seller' | 'buyer'): void {
    let email = '';
    
    switch (role) {
      case 'admin':
        email = 'admin@tienda.com';
        break;
      case 'seller':
        email = 'seller@tienda.com';
        break;
      case 'buyer':
        email = 'comprador@gmail.com';
        break;
    }

    this.loginForm.patchValue({
      username: email,
      password: '123456'
    });

    console.log(`🚀 Auto-llenado como ${role}:`, email);
  }
}
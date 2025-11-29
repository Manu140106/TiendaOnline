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
        
        if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (user.role === 'seller') {
          this.router.navigate(['/seller/products']);
        } else {
          this.router.navigate(['/products']);
        }
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
    alert('🔐 Recuperación de Contraseña\n\nEsta funcionalidad estará disponible próximamente.\n\nPor ahora puedes:\n- Usar cualquier email y contraseña para entrar\n- O crear una nueva cuenta');
    
    // Cuando crees la página, descomenta esta línea:
    // this.router.navigate(['/auth/forgot-password']);
  }
}
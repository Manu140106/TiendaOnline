import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.forgotForm.value.email;
    console.log('📧 Solicitando recuperación para:', email);

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('✅ Correo de recuperación enviado:', response);
        this.isLoading = false;
        this.emailSent = true;
        this.successMessage = response.message;
      },
      error: (error) => {
        console.error('❌ Error al enviar correo:', error);
        this.isLoading = false;
        this.errorMessage = 'No se pudo enviar el correo. Verifica el email e intenta nuevamente.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
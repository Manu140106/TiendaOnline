import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: false,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() form!: FormGroup;
  @Input() submitLabel = 'Ingresar';
  @Output() submitForm = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();

  onSubmit(): void {
    console.log('📝 Formulario enviado desde LoginFormComponent');
    if (this.form.valid) {
      this.submitForm.emit();
    } else {
      console.log('❌ Formulario inválido, marcando campos como tocados');
      this.form.markAllAsTouched();
    }
  }

  onForgotPasswordClick(): void {
    console.log('🔗 Link de contraseña olvidada clickeado');
    this.forgotPassword.emit();
  }
  
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }
}
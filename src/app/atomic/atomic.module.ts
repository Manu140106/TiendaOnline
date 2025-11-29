import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from './atoms/button/button.component';
import { InputComponent } from './atoms/input/input.component';
import { LabelComponent } from './atoms/label/label.component';
import { FormFieldComponent } from './molecules/form-field/form-field.component';
import { LoginFormComponent } from './organisms/login-form/login-form.component';
import { AuthTemplateComponent } from './templates/auth-template/auth-template.component';
import { DesignShowcaseComponent } from './pages/design-showcase/design-showcase.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from './organisms/product-card/product-card.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    LabelComponent, 
    FormFieldComponent,
    LoginFormComponent,
    AuthTemplateComponent,
    DesignShowcaseComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    LabelComponent,
    FormFieldComponent,
    LoginFormComponent,
    AuthTemplateComponent,
    DesignShowcaseComponent,
    ProductCardComponent,
    MatProgressSpinnerModule
  ]
})
export class AtomicModule { }
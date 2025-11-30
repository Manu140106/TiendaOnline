import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product;
  @Input() isLoading = false;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  isEditMode = false;

  categories = [
    'Electrónica',
    'Accesorios',
    'Audio',
    'Cámaras',
    'Computadoras',
    'Gaming',
    'Hogar',
    'Otros'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.product;
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.product?.description || '', [Validators.required, Validators.minLength(10)]],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      stock: [this.product?.stock || 0, [Validators.required, Validators.min(0)]],
      category: [this.product?.category || '', Validators.required],
      imageUrl: [this.product?.imageUrl || '']
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      
      if (this.isEditMode && this.product) {
        this.submitForm.emit({ ...formData, id: this.product.id });
      } else {
        this.submitForm.emit(formData);
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`;
      this.productForm.patchValue({ imageUrl: mockImageUrl });
      console.log('📸 Imagen simulada:', mockImageUrl);
    }
  }
}
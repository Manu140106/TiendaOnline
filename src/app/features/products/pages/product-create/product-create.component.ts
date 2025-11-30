import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  product?: Product;
  isLoading = false;
  isEditMode = false;
  productId?: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          console.log('✅ Producto cargado para edición:', product);
        } else {
          console.error('❌ Producto no encontrado');
          this.router.navigate(['/products']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando producto:', error);
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(formData: any): void {
    console.log('📝 Datos del formulario:', formData);
    this.isLoading = true;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: (updated) => {
          console.log('✅ Producto actualizado:', updated);
          this.isLoading = false;
          alert(`✅ Producto "${updated.name}" actualizado exitosamente`);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('❌ Error actualizando producto:', error);
          this.isLoading = false;
          alert('❌ Error al actualizar el producto. Intenta nuevamente.');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: (created) => {
          console.log('✅ Producto creado:', created);
          this.isLoading = false;
          alert(`✅ Producto "${created.name}" creado exitosamente`);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('❌ Error creando producto:', error);
          this.isLoading = false;
          alert('❌ Error al crear el producto. Intenta nuevamente.');
        }
      });
    }
  }

  onCancel(): void {
    const confirmCancel = confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.');
    if (confirmCancel) {
      this.router.navigate(['/products']);
    }
  }
}
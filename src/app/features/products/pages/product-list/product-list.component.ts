import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { User } from '../../../../core/models/user';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  isLoading = false;
  showCreateForm = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    console.log('✅ Usuario autenticado en Products:', this.currentUser);
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        console.log('✅ Productos cargados:', products.length);
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  onViewProduct(product: Product): void {
    console.log('👁️ Ver producto:', product.name);
    alert(`Ver detalles de: ${product.name}\n\nPrecio: $${product.price}\nStock: ${product.stock}\n\n(Funcionalidad en desarrollo)`);
  }

  onEditProduct(product: Product): void {
    console.log('✏️ Editar producto:', product.name);
    alert(`Editar: ${product.name}\n\n(Funcionalidad en desarrollo)`);
  }

  onDeleteProduct(product: Product): void {
    const confirmDelete = confirm(`¿Estás seguro de eliminar "${product.name}"?`);
    if (confirmDelete) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado:', product.name);
          this.loadProducts();
        },
        error: (error) => {
          console.error('❌ Error eliminando producto:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  onCreateProduct(): void {
    this.showCreateForm = true;
    alert('Crear nuevo producto\n\n(Formulario en desarrollo)');
  }

  logout(): void {
    this.authService.logout();
  }
}
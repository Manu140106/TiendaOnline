import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { User } from '../../../../core/models/user';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  isLoading = false;

  totalProducts = 0;
  totalSellers = 5;
  totalBuyers = 120;
  totalRevenue = 45670.50;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
 
    if (this.currentUser?.role !== 'admin') {
      alert('⛔ Acceso denegado. Solo administradores.');
      this.router.navigate(['/products']);
      return;
    }

    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalProducts = products.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  onEditProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteProduct(product: Product): void {
    const confirm = window.confirm(`¿Eliminar "${product.name}"?`);
    if (confirm) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          alert('✅ Producto eliminado');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
          alert('❌ Error al eliminar producto');
        }
      });
    }
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }

  logout(): void {
    this.authService.logout();
  }
}
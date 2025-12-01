import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { User } from '../../../../core/models/user';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  myProducts: Product[] = [];
  isLoading = false;

  totalProducts = 0;
  totalSales = 0;
  totalRevenue = 0;
  lowStockProducts = 0;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (this.currentUser?.role !== 'seller') {
      alert('⛔ Acceso denegado. Solo vendedores.');
      this.router.navigate(['/products']);
      return;
    }

    this.loadMyProducts();
  }

  loadMyProducts(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.productService.getProductsBySeller(this.currentUser.name).subscribe({
      next: (products) => {
        this.myProducts = products;
        this.totalProducts = products.length;
        this.calculateStats(products);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStats(products: Product[]): void {
    // Mock stats for demonstration
    this.totalSales = Math.floor(Math.random() * 100) + 50; // Random sales between 50-150
    this.totalRevenue = products.reduce((sum, product) => sum + (product.price * this.totalSales / products.length), 0);
    this.lowStockProducts = products.filter(p => p.stock < 10).length;
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
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
          this.loadMyProducts();
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
          alert('❌ Error al eliminar producto');
        }
      });
    }
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    this.authService.logout();
  }
}

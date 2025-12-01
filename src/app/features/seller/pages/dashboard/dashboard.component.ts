import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { User } from '../../../../core/models/user';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class SellerDashboardComponent implements OnInit {
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
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.myProducts = products.slice(0, 3);
        this.totalProducts = this.myProducts.length;
        this.lowStockProducts = this.myProducts.filter(p => p.stock < 10).length;

        this.totalSales = Math.floor(Math.random() * 50) + 10;
        this.totalRevenue = this.myProducts.reduce((sum, p) => sum + (p.price * 5), 0);
        
        this.isLoading = false;
        console.log('✅ Productos del vendedor cargados:', this.myProducts.length);
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }

  onEditProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDeleteProduct(product: Product): void {
    const confirm = window.confirm(`¿Eliminar "${product.name}" de tu tienda?`);
    if (confirm) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          alert('✅ Producto eliminado');
          this.loadMyProducts();
        },
        error: (error) => {
          console.error('❌ Error eliminando producto:', error);
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
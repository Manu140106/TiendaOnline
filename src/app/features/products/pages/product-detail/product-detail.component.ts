import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product || null;
        this.isLoading = false;
        console.log('✅ Producto cargado:', product);
      },
      error: (error) => {
        console.error('❌ Error cargando producto:', error);
        this.isLoading = false;
        alert('Producto no encontrado');
        this.goBack();
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      console.log('🛒 Agregar al carrito:', this.product.name, 'x', this.quantity);
      alert(`✅ Agregado al carrito:\n\n${this.product.name}\nCantidad: ${this.quantity}\n\n(Carrito en desarrollo)`);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
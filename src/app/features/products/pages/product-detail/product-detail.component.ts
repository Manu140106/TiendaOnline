import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
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
    private productService: ProductService,
    private cartService: CartService
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
      this.cartService.addItem(this.product, this.quantity);
      console.log('🛒 Agregado al carrito:', this.product.name, 'x', this.quantity);
      
      const goToCart = confirm(
        `✅ ${this.product.name} agregado al carrito!\n\nCantidad: ${this.quantity}\n\n¿Ir al carrito ahora?`
      );
      
      if (goToCart) {
        this.router.navigate(['/cart']);
      }
    }
  }

  buyNow(): void {
    if (!this.product) {
      alert('⚠️ Producto no disponible');
      return;
    }

    if (this.product.stock === 0) {
      alert('⚠️ Producto sin stock');
      return;
    }

    console.log('💳 Compra directa:', this.product.name, 'x', this.quantity);

    this.cartService.addItem(this.product, this.quantity);

    this.router.navigate(['/cart']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
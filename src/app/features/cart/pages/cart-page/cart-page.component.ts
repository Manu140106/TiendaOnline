import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  currentUser: User | null = null;
  isProcessing = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      console.log('🛒 Items en el carrito:', items.length);
    });
  }

  get subtotal(): number {
    return this.cartService.getTotal();
  }

  get shipping(): number {
    return this.subtotal > 50 ? 0 : 5.99;
  }

  get tax(): number {
    return this.subtotal * 0.08; 
  }

  get total(): number {
    return this.subtotal + this.shipping + this.tax;
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: string): void {
    const confirmRemove = confirm('¿Eliminar este producto del carrito?');
    if (confirmRemove) {
      this.cartService.removeItem(productId);
    }
  }

  clearCart(): void {
    const confirmClear = confirm('¿Vaciar todo el carrito?');
    if (confirmClear) {
      this.cartService.clearCart();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    this.isProcessing = true;
    console.log('💳 Procesando checkout...');

    setTimeout(() => {
      this.isProcessing = false;
      alert(`✅ ¡Compra exitosa!\n\nTotal: $${this.total.toFixed(2)}\n\n${this.cartItems.length} producto(s) comprados\n\n(Funcionalidad de pago en desarrollo)`);
      this.cartService.clearCart();
      this.router.navigate(['/products']);
    }, 2000);
  }
}
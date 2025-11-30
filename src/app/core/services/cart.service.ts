import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem(this.CART_KEY);
    if (stored) {
      const items = JSON.parse(stored);
      this.cartItemsSubject.next(items);
      console.log('🛒 Carrito cargado desde localStorage:', items.length);
    }
  }

  private saveCartToStorage(): void {
    const items = this.cartItemsSubject.value;
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    console.log('💾 Carrito guardado en localStorage');
  }

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = this.cartItemsSubject.value;
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      console.log('🛒 Cantidad actualizada:', product.name, 'x', existingItem.quantity);
    } else {
      items.push({ product, quantity });
      console.log('🛒 Producto agregado:', product.name, 'x', quantity);
    }

    this.cartItemsSubject.next([...items]);
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...items]);
        this.saveCartToStorage();
        console.log('🛒 Cantidad actualizada:', item.product.name, 'x', quantity);
      }
    }
  }

  removeItem(productId: string): void {
    const items = this.cartItemsSubject.value;
    const filtered = items.filter(item => item.product.id !== productId);
    
    this.cartItemsSubject.next(filtered);
    this.saveCartToStorage();
    console.log('🗑️ Producto eliminado del carrito');
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_KEY);
    console.log('🧹 Carrito limpiado');
  }
}
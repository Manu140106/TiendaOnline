import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-icon',
  standalone: false,
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {
  itemCount = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.itemCount = this.cartService.getItemCount();
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}

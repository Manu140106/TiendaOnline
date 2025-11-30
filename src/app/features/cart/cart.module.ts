import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AtomicModule } from '../../atomic/atomic.module';

@NgModule({
  declarations: [
    CartPageComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    AtomicModule
  ]
})
export class CartModule { }
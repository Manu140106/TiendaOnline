import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { AtomicModule } from '../../atomic/atomic.module';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreateComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AtomicModule,
    SharedModule
  ]
})
export class ProductsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { SellerDashboardComponent } from './pages/dashboard/dashboard.component';
import { AtomicModule } from '../../atomic/atomic.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SellerDashboardComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    AtomicModule,
    SharedModule
  ]
})
export class SellerModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { AtomicModule } from '../../atomic/atomic.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AtomicModule,
    SharedModule
  ]
})
export class AdminModule { }

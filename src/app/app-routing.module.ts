import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuard]  
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
    canActivate: [AuthGuard]  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
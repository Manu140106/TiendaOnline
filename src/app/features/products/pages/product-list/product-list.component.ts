import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { User } from '../../../../core/models/user';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  showCreateForm = false;
  showEditForm = false;
  showFilters = false;
  selectedProduct: Product | null = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    console.log('✅ Usuario autenticado en Products:', this.currentUser);
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
        console.log('✅ Productos cargados:', products.length);
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        this.isLoading = false;
      }
    });
  }

  onFiltersChange(filters: any): void {
    console.log('🔍 Filtros aplicados:', filters);
    
    let filtered = [...this.products];

    if (filters.searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'stock-desc':
          filtered.sort((a, b) => b.stock - a.stock);
          break;
      }
    }

    this.filteredProducts = filtered;
    console.log('✅ Productos filtrados:', filtered.length);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onViewProduct(product: Product): void {
    console.log('👁️ Ver producto:', product.name);
    this.router.navigate(['/products/detail', product.id]);
  }

  onEditProduct(product: Product): void {
    console.log('✏️ Editar producto:', product.name);
    alert(`Editar: ${product.name}\n\n(Funcionalidad en desarrollo)`);
  }

  onDeleteProduct(product: Product): void {
    const confirmDelete = confirm(`¿Estás seguro de eliminar "${product.name}"?`);
    if (confirmDelete) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado:', product.name);
          this.loadProducts(); 
        },
        error: (error) => {
          console.error('❌ Error eliminando producto:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  onCreateProduct(): void {
    this.showCreateForm = true;
    alert('Crear nuevo producto\n\n(Formulario en desarrollo)');
  }

  logout(): void {
    this.authService.logout();
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.selectedProduct = null;
  }

  onFormSubmit(product: Product): void {
    if (this.selectedProduct) {

      this.productService.updateProduct(this.selectedProduct.id, product).subscribe({
        next: () => {
          console.log('✅ Producto actualizado:', product.name);
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('❌ Error actualizando producto:', error);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => {
          console.log('✅ Producto creado:', product.name);
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('❌ Error creando producto:', error);
          alert('Error al crear el producto');
        }
      });
    }
  }
}

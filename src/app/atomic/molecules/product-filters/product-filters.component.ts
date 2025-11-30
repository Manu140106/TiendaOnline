import { Component, Output, EventEmitter } from '@angular/core';

export interface ProductFilters {
  searchTerm: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: false,
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss']
})
export class ProductFiltersComponent {
  @Output() filtersChange = new EventEmitter<ProductFilters>();

  searchTerm = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = '';

  categories = [
    'Todas',
    'Electrónica',
    'Accesorios',
    'Audio',
    'Cámaras',
    'Computadoras',
    'Gaming'
  ];

  sortOptions = [
    { value: '', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'name-asc', label: 'Nombre: A-Z' },
    { value: 'name-desc', label: 'Nombre: Z-A' },
    { value: 'stock-desc', label: 'Mayor Stock' }
  ];

  onSearchChange(): void {
    this.emitFilters();
  }

  onCategoryChange(): void {
    this.emitFilters();
  }

  onPriceChange(): void {
    this.emitFilters();
  }

  onSortChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = '';
    this.emitFilters();
  }

  private emitFilters(): void {
    const filters: ProductFilters = {
      searchTerm: this.searchTerm,
      category: this.selectedCategory === 'Todas' ? '' : this.selectedCategory,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy
    };
    this.filtersChange.emit(filters);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Cambiar cuando tengas backend real

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop HP Pavilion',
      description: 'Laptop de alto rendimiento con procesador Intel i7',
      price: 1299.99,
      stock: 15,
      category: 'Electrónica',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      sellerName: 'TechStore',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Mouse Logitech MX Master 3',
      description: 'Mouse ergonómico para productividad',
      price: 99.99,
      stock: 50,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
      sellerName: 'Peripherals Inc',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Teclado Mecánico RGB',
      description: 'Teclado mecánico con iluminación RGB personalizable',
      price: 159.99,
      stock: 30,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      sellerName: 'Gaming Pro',
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Monitor LG UltraWide 34"',
      description: 'Monitor ultrawide para máxima productividad',
      price: 499.99,
      stock: 10,
      category: 'Electrónica',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      sellerName: 'DisplayWorld',
      createdAt: new Date()
    },
    {
      id: '5',
      name: 'Auriculares Sony WH-1000XM4',
      description: 'Auriculares con cancelación de ruido premium',
      price: 349.99,
      stock: 25,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      sellerName: 'AudioPro',
      createdAt: new Date()
    },
    {
      id: '6',
      name: 'Webcam Logitech C920',
      description: 'Webcam Full HD para videollamadas',
      price: 79.99,
      stock: 40,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1589739900243-c651dd1755fe?w=400',
      sellerName: 'TechStore',
      createdAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {
    this.productsSubject.next(this.mockProducts);
  }

  getAllProducts(): Observable<Product[]> {
    console.log('📦 ProductService: Obteniendo productos (MOCK)');
    return of(this.mockProducts).pipe(
      delay(500), 
      tap(products => {
        console.log('✅ Productos obtenidos:', products.length);
        this.productsSubject.next(products);
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    console.log('📦 ProductService: Obteniendo producto por ID:', id);
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    console.log('📦 ProductService: Creando producto (MOCK):', product);
    
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      sellerName: 'Mi Tienda'
    };

    return of(newProduct).pipe(
      delay(500),
      tap(created => {
        this.mockProducts.push(created);
        this.productsSubject.next([...this.mockProducts]);
        console.log('✅ Producto creado:', created);
      })
    );
  }

  updateProduct(id: string, product: UpdateProductRequest): Observable<Product> {
    console.log('📦 ProductService: Actualizando producto (MOCK):', id);
    
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    const updated: Product = {
      ...this.mockProducts[index],
      ...product,
      updatedAt: new Date()
    };

    return of(updated).pipe(
      delay(500),
      tap(updatedProduct => {
        this.mockProducts[index] = updatedProduct;
        this.productsSubject.next([...this.mockProducts]);
        console.log('✅ Producto actualizado:', updatedProduct);
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    console.log('📦 ProductService: Eliminando producto (MOCK):', id);
    
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.mockProducts.splice(index, 1);
        this.productsSubject.next([...this.mockProducts]);
        console.log('✅ Producto eliminado');
      })
    );
  }

  getAllProductsReal(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProductReal(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProductReal(id: string, product: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProductReal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
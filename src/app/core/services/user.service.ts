import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@tienda.com',
      name: 'Administrador Principal',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=12',
      phone: '+57 300 123 4567',
      address: 'Calle Principal 123',
      isActive: true,
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      email: 'seller@tienda.com',
      name: 'Vendedor TechStore',
      role: 'seller',
      avatar: 'https://i.pravatar.cc/150?img=33',
      phone: '+57 301 234 5678',
      address: 'Avenida Comercio 456',
      isActive: true,
      createdAt: new Date('2023-02-20')
    },
    {
      id: '3',
      email: 'comprador@gmail.com',
      name: 'Juan Pérez',
      role: 'buyer',
      avatar: 'https://i.pravatar.cc/150?img=55',
      phone: '+57 302 345 6789',
      address: 'Carrera 10 #20-30',
      isActive: true,
      createdAt: new Date('2023-03-10')
    },
    {
      id: '4',
      email: 'maria.gomez@email.com',
      name: 'María Gómez',
      role: 'buyer',
      avatar: 'https://i.pravatar.cc/150?img=44',
      phone: '+57 303 456 7890',
      address: 'Calle 50 #15-20',
      isActive: true,
      createdAt: new Date('2023-04-05')
    },
    {
      id: '5',
      email: 'vendedor2@tienda.com',
      name: 'Carlos Rodríguez',
      role: 'seller',
      avatar: 'https://i.pravatar.cc/150?img=68',
      phone: '+57 304 567 8901',
      address: 'Centro Comercial Norte',
      isActive: true,
      createdAt: new Date('2023-05-12')
    }
  ];

  constructor(private http: HttpClient) {
    this.usersSubject.next(this.mockUsers);
  }

  getAllUsers(): Observable<User[]> {
    console.log('👥 UserService: Obteniendo usuarios (MOCK)');
    return of(this.mockUsers).pipe(
      delay(500),
      tap(users => {
        console.log('✅ Usuarios obtenidos:', users.length);
        this.usersSubject.next(users);
      })
    );
  }

  getUserById(id: string): Observable<User | undefined> {
    console.log('👥 UserService: Obteniendo usuario por ID:', id);
    const user = this.mockUsers.find(u => u.id === id);
    return of(user).pipe(delay(300));
  }

  getUsersByRole(role: 'admin' | 'seller' | 'buyer'): Observable<User[]> {
    console.log('👥 UserService: Filtrando por rol:', role);
    const filtered = this.mockUsers.filter(u => u.role === role);
    return of(filtered).pipe(delay(300));
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    console.log('👥 UserService: Creando usuario (MOCK):', userData);
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      isActive: true,
      createdAt: new Date()
    };

    return of(newUser).pipe(
      delay(500),
      tap(created => {
        this.mockUsers.push(created);
        this.usersSubject.next([...this.mockUsers]);
        console.log('✅ Usuario creado:', created);
      })
    );
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    console.log('👥 UserService: Actualizando usuario (MOCK):', id);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    const updated: User = {
      ...this.mockUsers[index],
      ...userData
    };

    return of(updated).pipe(
      delay(500),
      tap(updatedUser => {
        this.mockUsers[index] = updatedUser;
        this.usersSubject.next([...this.mockUsers]);
        console.log('✅ Usuario actualizado:', updatedUser);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    console.log('👥 UserService: Eliminando usuario (MOCK):', id);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.mockUsers.splice(index, 1);
        this.usersSubject.next([...this.mockUsers]);
        console.log('✅ Usuario eliminado');
      })
    );
  }

  toggleUserStatus(id: string): Observable<User> {
    console.log('👥 UserService: Cambiando estado usuario:', id);
    
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    const user = this.mockUsers[index];
    user.isActive = !user.isActive;

    return of(user).pipe(
      delay(300),
      tap(() => {
        this.usersSubject.next([...this.mockUsers]);
        console.log('✅ Estado cambiado:', user.isActive ? 'Activo' : 'Inactivo');
      })
    );
  }

  getUserStats(): Observable<any> {
    return of({
      total: this.mockUsers.length,
      admins: this.mockUsers.filter(u => u.role === 'admin').length,
      sellers: this.mockUsers.filter(u => u.role === 'seller').length,
      buyers: this.mockUsers.filter(u => u.role === 'buyer').length,
      active: this.mockUsers.filter(u => u.isActive).length,
      inactive: this.mockUsers.filter(u => !u.isActive).length
    }).pipe(delay(300));
  }
}
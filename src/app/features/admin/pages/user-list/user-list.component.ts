import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  showModal = false;
  isEditMode = false;
  selectedUser: User | null = null;
  currentUserId: string | null = null;

  searchTerm = '';
  filterRole: string = '';
  filterStatus: string = '';

  userForm!: FormGroup;

  stats = {
    total: 0,
    admins: 0,
    sellers: 0,
    buyers: 0,
    active: 0,
    inactive: 0
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.currentUserId = currentUser?.id || null;

    this.initForm();
    this.loadUsers();
    this.loadStats();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      phone: [''],
      address: [''],
      isActive: [true]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
        console.log('✅ Usuarios cargados:', users.length);
      },
      error: (error) => {
        console.error('❌ Error cargando usuarios:', error);
        this.isLoading = false;
        alert('Error al cargar usuarios');
      }
    });
  }

  loadStats(): void {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('📊 Stats cargadas:', stats);
      },
      error: (error) => {
        console.error('❌ Error cargando stats:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    if (this.filterRole) {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }

    if (this.filterStatus) {
      const isActive = this.filterStatus === 'active';
      filtered = filtered.filter(u => u.isActive === isActive);
    }

    this.filteredUsers = filtered;
    console.log('🔍 Filtros aplicados:', filtered.length, 'usuarios');
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterRole = '';
    this.filterStatus = '';
    this.filteredUsers = [...this.users];
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUser = null;
    this.userForm.reset({ isActive: true });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.selectedUser = user;
    
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      isActive: user.isActive
    });
    
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    if (this.isEditMode && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, {
        id: this.selectedUser.id,
        ...formData
      }).subscribe({
        next: (updated) => {
          console.log('✅ Usuario actualizado:', updated);
          alert(`✅ Usuario "${updated.name}" actualizado exitosamente`);
          this.loadUsers();
          this.loadStats();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error actualizando usuario:', error);
          alert('❌ Error al actualizar el usuario');
        }
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: (created) => {
          console.log('✅ Usuario creado:', created);
          alert(`✅ Usuario "${created.name}" creado exitosamente`);
          this.loadUsers();
          this.loadStats();
          this.closeModal();
        },
        error: (error) => {
          console.error('❌ Error creando usuario:', error);
          alert('❌ Error al crear el usuario');
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUserId) {
      alert('⚠️ No puedes eliminarte a ti mismo');
      return;
    }

    const confirmDelete = confirm(
      `¿Estás seguro de eliminar al usuario "${user.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          console.log('✅ Usuario eliminado:', user.name);
          alert(`✅ Usuario "${user.name}" eliminado exitosamente`);
          this.loadUsers();
          this.loadStats();
        },
        error: (error) => {
          console.error('❌ Error eliminando usuario:', error);
          alert('❌ Error al eliminar el usuario');
        }
      });
    }
  }

  toggleStatus(user: User): void {
    if (user.id === this.currentUserId) {
      alert('⚠️ No puedes cambiar tu propio estado');
      return;
    }

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updated) => {
        console.log('✅ Estado cambiado:', updated.name, updated.isActive);
        const status = updated.isActive ? 'activado' : 'desactivado';
        alert(`✅ Usuario "${updated.name}" ${status} exitosamente`);
        this.loadUsers();
        this.loadStats();
      },
      error: (error) => {
        console.error('❌ Error cambiando estado:', error);
        alert('❌ Error al cambiar el estado del usuario');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser: AdminUser | null = null;
  isSidebarCollapsed = false;
  showUserMenu = false;
  showMobileMenu = false;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
      badge: null
    },
    {
      label: 'Visitors',
      icon: 'visitors',
      route: '/admin/visitors',
      badge: null
    },
    {
      label: 'Submissions',
      icon: 'submissions',
      route: '/admin/submissions',
      badge: 'pending'
    }
  ];

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'AD';

    const username = this.currentUser.username || '';
    return username.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(): string {
    if (!this.currentUser) return 'role-viewer';

    switch (this.currentUser.role) {
      case 'super_admin':
        return 'role-super-admin';
      case 'admin':
        return 'role-admin';
      default:
        return 'role-viewer';
    }
  }
}

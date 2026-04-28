import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './admin/guards/auth.guard';

export const routes: Routes = [
  // Landing page (default)
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full'
  },
  // Shop page (Blinkit-style catalog)
  {
    path: 'shop',
    loadComponent: () =>
      import('./components/shop/shop.component').then(m => m.ShopComponent)
  },
  // Admin routes
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/components/login/login.component').then(m => m.LoginComponent),
        canActivate: [loginGuard]
      },
      {
        path: '',
        loadComponent: () =>
          import('./admin/components/layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./admin/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'visitors',
            loadComponent: () =>
              import('./admin/components/visitors/visitors.component').then(m => m.VisitorsComponent)
          },
          {
            path: 'submissions',
            loadComponent: () =>
              import('./admin/components/submissions/submissions.component').then(m => m.SubmissionsComponent)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  // Fallback — send unknown URLs back to the landing page
  {
    path: '**',
    redirectTo: ''
  }
];

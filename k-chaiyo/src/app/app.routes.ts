import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './admin/guards/auth.guard';

export const routes: Routes = [
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
  // Default redirect
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

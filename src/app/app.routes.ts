import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from './features/profile/pages/profile-settings/profile-settings.component';
import { HistoryPageComponent } from './features/profile/pages/history-page/history-page.component'; // ← NUEVO

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/iam/pages/login/login.page').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/iam/pages/register/register.page').then(m => m.RegisterPageComponent)
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./features/iam/pages/password-recovery/password-recovery.page').then(m => m.PasswordRecoveryPageComponent)
  },
  {
    path: 'password-recovery/new-password',
    loadComponent: () => import('./features/iam/pages/password-recovery-newpassword/password-recovery-newpassword.page').then(m => m.PasswordRecoveryNewpasswordPageComponent)
  },
  {

    path: 'profile/notifications',
    component: ProfileSettingsComponent
  },
  {
    path: 'profile/history',
    component: HistoryPageComponent  // ← NUEVA RUTA

    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

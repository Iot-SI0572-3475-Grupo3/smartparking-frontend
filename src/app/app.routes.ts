import { Routes } from '@angular/router';

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
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

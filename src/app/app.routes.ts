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
    path: 'penalty-first-absence',
    loadComponent: () => import('./features/penalty/pages/penalty-first-absence/penalty-first-absence.page').then(m => m.PenaltyFirstAbsencePageComponent)
  },
  {
    path: 'penalty-second-absence',
    loadComponent: () => import('./features/penalty/pages/penalty-second-absence/penalty-second-absence.page').then(m => m.PenaltySecondAbsencePageComponent)
  },
  {
    path: 'penalty-account-suspended',
    loadComponent: () => import('./features/penalty/pages/penalty-account-suspended/penalty-account-suspended.page').then(m => m.PenaltyAccountSuspendedPageComponent)
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

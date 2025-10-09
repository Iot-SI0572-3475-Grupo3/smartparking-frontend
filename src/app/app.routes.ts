import { Routes } from '@angular/router';
import {UserProfileComponent} from "./features/profiles/components/user-profile/user-profile.component";

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
    path: 'profile',
    loadComponent: () => import('./features/profiles/components/user-profile/user-profile.component').then(m => m.UserProfileComponent)
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

import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from './features/profile/pages/profile-settings/profile-settings.component';
import { HistoryPageComponent } from './features/profile/pages/history-page/history-page.component';
import {UserProfileComponent} from "./features/profile/pages/user-profile/user-profile.component";
import {ParkingAdminDashboardComponent} from "./features/dashboard/pages/parking-admin-dashboard/parking-admin-dashboard.component";
import {authenticationGuard} from "./features/iam/services/authentication.guard";

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
    component: UserProfileComponent,
    //canActivate: [authenticationGuard]
  },
  {
    path: 'profile/notifications',
    component: ProfileSettingsComponent,
    //canActivate: [authenticationGuard]
  },
  {
    path: 'history',
    component: HistoryPageComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent),
    canActivate: [authenticationGuard]
  },
  {
    path: 'admin/dashboard',
    component: ParkingAdminDashboardComponent
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

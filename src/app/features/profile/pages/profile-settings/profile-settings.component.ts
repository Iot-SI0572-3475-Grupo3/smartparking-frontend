import { Component } from '@angular/core';
import { PushNotificationsComponent } from '../../components/push-notifications/push-notifications.component';
import {NavbarComponent} from "../../../../layout/navbar/navbar.component";

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [PushNotificationsComponent, NavbarComponent], // ← Agregar
  template: `
    <app-navbar></app-navbar>
    <app-push-notifications></app-push-notifications>
  `
})
export class ProfileSettingsComponent {}

import { Component } from '@angular/core';
import { PushNotificationsComponent } from '../../components/push-notifications/push-notifications.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [PushNotificationsComponent], // ← Quitar NavbarComponent
  template: `
    <app-push-notifications></app-push-notifications>
  `
})
export class ProfileSettingsComponent {}

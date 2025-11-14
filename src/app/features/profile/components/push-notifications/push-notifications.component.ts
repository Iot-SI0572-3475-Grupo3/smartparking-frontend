import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationPreference, DEFAULT_NOTIFICATION_PREFERENCES } from '../../models/notification-preference.model';

@Component({
  selector: 'app-push-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-notifications.component.html',
  styleUrl: './push-notifications.component.scss'
})
export class PushNotificationsComponent implements OnInit {
  preferences: NotificationPreference[] = [];
  hasChanges = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPreferences();
    } else {
      this.preferences = [...DEFAULT_NOTIFICATION_PREFERENCES];
    }
  }

  loadPreferences(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('notificationPreferences');
      if (saved) {
        this.preferences = JSON.parse(saved);
      } else {
        this.preferences = [...DEFAULT_NOTIFICATION_PREFERENCES];
      }
    }
  }

  onToggleChange(preference: NotificationPreference): void {
    this.hasChanges = true;
  }

  saveChanges(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
      this.hasChanges = false;
      alert('Cambios guardados exitosamente');
    }
  }
}

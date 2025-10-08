import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryEmailComponent } from '../../components/password-recovery-email/password-recovery-email.component';

@Component({
  selector: 'app-password-recovery-page',
  standalone: true,
  imports: [CommonModule, PasswordRecoveryEmailComponent],
  template: `
    <app-password-recovery-email></app-password-recovery-email>
  `,
  styles: []
})
export class PasswordRecoveryPageComponent {}

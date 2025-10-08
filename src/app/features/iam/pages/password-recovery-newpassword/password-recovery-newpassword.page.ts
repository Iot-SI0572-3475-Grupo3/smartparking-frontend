import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryNewpasswordComponent } from '../../components/password-recovery-newpassword/password-recovery-newpassword.component';

@Component({
  selector: 'app-password-recovery-newpassword-page',
  standalone: true,
  imports: [CommonModule, PasswordRecoveryNewpasswordComponent],
  template: `
    <app-password-recovery-newpassword></app-password-recovery-newpassword>
  `,
  styles: []
})
export class PasswordRecoveryNewpasswordPageComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltyAccountSuspendedComponent } from '../../components/penalty-account-suspended/penalty-account-suspended.component';
import { NavbarComponent } from '../../../../layout/navbar/navbar.component';

@Component({
  selector: 'app-penalty-account-suspended-page',
  standalone: true,
  imports: [CommonModule, PenaltyAccountSuspendedComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <app-penalty-account-suspended></app-penalty-account-suspended>
  `,
  styles: []
})
export class PenaltyAccountSuspendedPageComponent {}
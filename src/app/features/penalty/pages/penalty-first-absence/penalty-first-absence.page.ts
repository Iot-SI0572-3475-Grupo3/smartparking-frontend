import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltyFirstAbsenceComponent } from '../../components/penalty-first-absence/penalty-first-absence.component';
import { NavbarComponent } from '../../../../layout/navbar/navbar.component';

@Component({
  selector: 'app-penalty-first-absence-page',
  standalone: true,
  imports: [CommonModule, PenaltyFirstAbsenceComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <app-penalty-first-absence></app-penalty-first-absence>
  `,
  styles: []
})
export class PenaltyFirstAbsencePageComponent {}
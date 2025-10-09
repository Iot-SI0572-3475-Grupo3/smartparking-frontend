import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltySecondAbsenceComponent } from '../../components/penalty-second-absence/penalty-second-absence.component';
import { NavbarComponent } from '../../../../layout/navbar/navbar.component';

@Component({
  selector: 'app-penalty-second-absence-page',
  standalone: true,
  imports: [CommonModule, PenaltySecondAbsenceComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <app-penalty-second-absence></app-penalty-second-absence>
  `,
  styles: []
})
export class PenaltySecondAbsencePageComponent {}
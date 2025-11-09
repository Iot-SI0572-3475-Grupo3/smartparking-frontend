import { Component } from '@angular/core';
import { ReservationHistoryComponent } from '../../components/reservation-history/reservation-history.component';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [ReservationHistoryComponent], // ← Sin NavbarComponent
  template: `
    <app-reservation-history></app-reservation-history>
  `
})
export class HistoryPageComponent {}

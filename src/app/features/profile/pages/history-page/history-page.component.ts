import { Component } from '@angular/core';
import { ReservationHistoryComponent } from '../../components/reservation-history/reservation-history.component';
import { NavbarComponent} from "../../../../layout/navbar/navbar.component";

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [ReservationHistoryComponent, NavbarComponent],
  template: `
    <app-reservation-history></app-reservation-history>
  `
})
export class HistoryPageComponent {}

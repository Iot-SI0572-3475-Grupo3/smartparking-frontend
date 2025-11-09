import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpaceCardComponent } from '../../components/space-card/space-card.component';
import { NewReserveCardComponent } from '../../components/new-reserve-card/new-reserve-card.component';
import { StateAbsencesCardComponent } from '../../components/state-absences-card/state-absences-card.component';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';
import type { SpaceCardData } from '../../components/space-card/space-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    SpaceCardComponent,
    NewReserveCardComponent,
    StateAbsencesCardComponent,
    HistoryTableComponent
  ],
  templateUrl: './dashboard.page.html',
  styles: []
})
export class DashboardPageComponent {

  constructor(private router: Router) {}

  availableSpaces: SpaceCardData[] = [
    { id: '1', name: 'Espacio A', status: 'available' },
    { id: '2', name: 'Espacio B', status: 'available' },
    { id: '3', name: 'Espacio C', status: 'available' },
    { id: '4', name: 'Espacio D', status: 'available' }
  ];

  absencesCount = 0;

  onReserveClick() {
    console.log('Botón de reservar clickeado');
  }

  onViewAllHistory() {
    this.router.navigate(['/profile/history']);
  }

  onRecordClick(record: any) {
    console.log('Registro clickeado:', record);
  }
}

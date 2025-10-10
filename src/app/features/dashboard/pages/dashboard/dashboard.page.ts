import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceCardComponent, SpaceCardData, SpaceStatus } from '../../components/space-card/space-card.component';
import { HistoryTableComponent, HistoryRecord } from '../../components/history-table/history-table.component';
import { NewReserveCardComponent } from '../../components/new-reserve-card/new-reserve-card.component';
import { StateAbsencesCardComponent } from '../../components/state-absences-card/state-absences-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, SpaceCardComponent, HistoryTableComponent, NewReserveCardComponent, StateAbsencesCardComponent],
  template: `
    <div class="min-h-screen bg-background-secondary p-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Sección 1: Espacios Disponibles y Nueva Reserva -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <!-- Espacios Disponibles -->
          <div class="lg:col-span-3">
            <h2 class="text-text-primary font-bold text-2xl mb-6">Espacios Disponibles</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (space of spaces; track space.id) {
                <app-space-card
                  [space]="space"
                ></app-space-card>
              }
            </div>
          </div>
          
          <!-- Nueva Reserva -->
          <div class="lg:col-span-1">
            <app-new-reserve-card
              (reserveClicked)="onNewReserveClick()"
            ></app-new-reserve-card>
          </div>
        </div>

        <!-- Sección 2: Últimas Sesiones y Estado de Ausencias -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Últimas Sesiones -->
          <div class="lg:col-span-3">
            <h2 class="text-text-primary font-bold text-2xl mb-6">Últimas Sesiones</h2>
            <app-history-table
              (viewAllClicked)="onViewAllHistory()"
              (recordClicked)="onHistoryRecordClick($event)"
            ></app-history-table>
          </div>
          
          <!-- Estado de Ausencias -->
          <div class="lg:col-span-1 flex items-start">
            <div class="w-full mt-16">
              <app-state-absences-card
                [absencesCount]="currentAbsences"
              ></app-state-absences-card>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: []
})
export class DashboardPageComponent {
  // Solo 4 espacios de ejemplo
  spaces: SpaceCardData[] = [
    { id: '1', name: 'Espacio A', status: 'available' },
    { id: '2', name: 'Espacio B', status: 'available' },
    { id: '3', name: 'Espacio C', status: 'available' },
    { id: '4', name: 'Espacio D', status: 'available' },
  ];

  // Número actual de ausencias
  currentAbsences: number = 0;

  // Manejar click en "Ver historial completo"
  onViewAllHistory() {
    console.log('Ver historial completo clickeado');
    // Aquí podrías navegar a una página de historial completo
  }

  // Manejar click en un registro del historial
  onHistoryRecordClick(record: HistoryRecord) {
    console.log('Registro del historial clickeado:', record);
    // Aquí podrías mostrar detalles del registro
  }

  // Manejar click en nueva reserva
  onNewReserveClick() {
    console.log('Nueva reserva clickeada');
    // Aquí podrías navegar a la página de reservas o abrir un modal
  }
}

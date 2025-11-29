import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceCardComponent, SpaceCardData } from '../../components/space-card/space-card.component';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';
import { NewReserveCardComponent } from '../../components/new-reserve-card/new-reserve-card.component';
import { StateAbsencesCardComponent } from '../../components/state-absences-card/state-absences-card.component';
import { ReserveModalComponent } from '../../components/reserve-modal/reserve-modal.component';
import { ActiveReservationCardComponent } from '../../components/active-reservation-card/active-reservation-card.component';
import { ActiveSessionCardComponent } from '../../components/active-session-card/active-session-card.component';
import { ReservationService } from '../../services/reservation.service';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { TestControlsComponent } from '../../components/test-controls/test-controls.component';


@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    SpaceCardComponent,
    HistoryTableComponent,
    NewReserveCardComponent,
    StateAbsencesCardComponent,
    ReserveModalComponent,
    ActiveReservationCardComponent,
    ActiveSessionCardComponent,
    TestControlsComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  // Signals del servicio
  parkingSpaces = this.reservationService.parkingSpaces;
  hasActiveReservation = this.reservationService.hasActiveReservation;
  hasActiveSession = this.reservationService.hasActiveSession;

  // Control del modal
  showReserveModal = false;

  // Número actual de ausencias (mock)
  currentAbsences: number = 0;

  // Control de si el usuario puede reservar
  canReserve: boolean = true;

  constructor(
    private reservationService: ReservationService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Carga los datos del dashboard desde el backend
   */
  loadDashboardData(): void {
    this.dashboardService.getUserDashboard().subscribe({
      next: (response) => {
        console.log('✅ Dashboard data loaded:', response);

        // Actualizar ausencias
        this.currentAbsences = response.absenceCount;

        // Actualizar si el usuario puede reservar
        this.canReserve = response.canReserve;

        // Mostrar alerta si no puede reservar
        if (!response.canReserve) {
          alert('⚠️ No puedes crear nuevas reservas debido a ausencias acumuladas.');
        }

        // Opcional: sincronizar espacios disponibles con el backend
        // this.syncParkingSpaces(response.availableSpaces);
      },
      error: (error) => {
        console.error('❌ Error loading dashboard:', error);

        // Manejar errores específicos
        if (error.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          alert('Error al cargar el dashboard. Por favor, intenta de nuevo.');
        }
      }
    });
  }

  // Convertir ParkingSpace a SpaceCardData para el componente
  getSpaceCardData(): SpaceCardData[] {
    return this.parkingSpaces().map(space => ({
      id: space.id,
      name: space.name,
      status: space.status
    }));
  }

  // Abrir modal de reserva
  openReserveModal(): void {
    // Solo permitir si no hay reserva ni sesión activa Y si puede reservar
    if (this.hasActiveReservation() || this.hasActiveSession()) {
      alert('Ya tienes una reserva o sesión activa');
      return;
    }

    if (!this.canReserve) {
      alert('⚠️ No puedes crear nuevas reservas debido a ausencias acumuladas.');
      return;
    }

    this.showReserveModal = true;
  }

  // Cerrar modal de reserva
  closeReserveModal(): void {
    this.showReserveModal = false;
  }

  // Manejar creación exitosa de reserva
  onReservationCreated(): void {
    this.showReserveModal = false;
    console.log('✅ Reserva creada exitosamente');

    // Recargar datos del dashboard después de crear reserva
    this.loadDashboardData();
  }

  // Navegar a historial completo
  onViewAllHistory(): void {
    this.router.navigate(['/history']);
  }

  // Manejar click en registro del historial
  onHistoryRecordClick(record: any): void {
    console.log('📋 Registro clickeado:', record);
    // Aquí podrías abrir un modal con detalles
  }
}

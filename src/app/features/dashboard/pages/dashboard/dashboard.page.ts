// src/app/features/dashboard/pages/dashboard/dashboard.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription, interval } from 'rxjs';

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
export class DashboardPageComponent implements OnInit, OnDestroy {

  // ✅ Signals del servicio (reactivos)
  parkingSpaces = this.reservationService.parkingSpaces;
  hasActiveReservation = this.reservationService.hasActiveReservation;
  hasActiveSession = this.reservationService.hasActiveSession;

  // Control del modal
  showReserveModal = false;

  // Estado de ausencias y permisos
  currentAbsences: number = 0;
  canReserve: boolean = true;

  // ✅ Subscripción para auto-refresh
  private refreshSubscription?: Subscription;

  constructor(
    private reservationService: ReservationService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  // ===== NUEVO: Auto-refresh cada 10 segundos =====
  private startAutoRefresh(): void {
    this.refreshSubscription = interval(10000).subscribe(() => {
      this.reservationService.loadParkingSpaces();
      this.reservationService.loadActiveReservation();
    });
  }

  // ===== Cargar datos del dashboard =====
  loadDashboardData(): void {
    this.dashboardService.getUserDashboard().subscribe({
      next: (response) => {
        console.log('✅ Dashboard data loaded:', response);
        this.currentAbsences = response.absenceCount;
        this.canReserve = response.canReserve;

        if (!response.canReserve) {
          alert('⚠️ No puedes crear nuevas reservas debido a ausencias acumuladas.');
        }
      },
      error: (error) => {
        console.error('❌ Error loading dashboard:', error);
        if (error.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          alert('Error al cargar el dashboard. Por favor, intenta de nuevo.');
        }
      }
    });
  }

  // ===== Convertir ParkingSpace a SpaceCardData =====
  getSpaceCardData(): SpaceCardData[] {
    return this.parkingSpaces().map(space => ({
      id: space.id,
      name: space.name,
      status: space.status
    }));
  }

  // ===== Abrir modal de reserva =====
  openReserveModal(): void {
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

  // ===== Cerrar modal de reserva =====
  closeReserveModal(): void {
    this.showReserveModal = false;
  }

  // ===== Manejar creación exitosa de reserva =====
  onReservationCreated(): void {
    this.showReserveModal = false;
    console.log('✅ Reserva creada exitosamente');

    // ✅ Recargar datos del dashboard
    setTimeout(() => {
      this.loadDashboardData();
    }, 1000);
  }

  // ===== Navegar a historial completo =====
  onViewAllHistory(): void {
    this.router.navigate(['/history']);
  }

  // ===== Manejar click en registro del historial =====
  onHistoryRecordClick(record: any): void {
    console.log('📋 Registro clickeado:', record);
  }
}

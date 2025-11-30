import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-active-reservation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-reservation-card.component.html',
  styleUrls: ['./active-reservation-card.component.scss']
})
export class ActiveReservationCardComponent implements OnInit, OnDestroy {
  reservation = this.reservationService.activeReservation;

  // ✅ AGREGAR ESTO - Exponer Math al template
  readonly Math = Math;

  private intervalId: any;
  remainingTime = signal<number>(0);

  progressPercentage = computed(() => {
    const total = 30 * 60;
    const remaining = this.remainingTime();
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  });

  formattedTime = computed(() => {
    const seconds = this.remainingTime();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  });

  isWarning = computed(() => this.remainingTime() < 5 * 60);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    // ✅ CARGAR RESERVA ACTIVA DEL BACKEND
    this.loadActiveReservation();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ✅ NUEVO MÉTODO: Cargar desde backend
  private loadActiveReservation(): void {
    this.reservationService.getActiveReservationHttp().subscribe({
      next: (response) => {
        console.log('✅ Reserva activa cargada desde backend:', response);
        // Aquí podrías actualizar el signal local si quieres
        // O transformar la respuesta para mostrarla directamente
      },
      error: (error) => {
        if (error.status === 204) {
          console.log('ℹ️ No hay reserva activa');
        } else {
          console.error('❌ Error cargando reserva activa:', error);
        }
      }
    });
  }

  private startCountdown(): void {
    this.updateRemainingTime();

    this.intervalId = setInterval(() => {
      this.updateRemainingTime();

      if (this.remainingTime() <= 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  private updateRemainingTime(): void {
    const res = this.reservation();
    if (!res) {
      this.remainingTime.set(0);
      return;
    }

    const now = Date.now();
    const deadline = res.arrivalDeadline.getTime();
    const remaining = Math.max(0, Math.floor((deadline - now) / 1000));

    this.remainingTime.set(remaining);
  }

  onCancelReservation(): void {
    if (confirm('¿Estás seguro de cancelar tu reserva?')) {
      const res = this.reservation();
      if (!res) return;

      // ✅ LLAMAR AL BACKEND PARA CANCELAR
      this.reservationService.cancelReservationHttp(res.id, 'Cancelado por el usuario').subscribe({
        next: () => {
          console.log('✅ Reserva cancelada en backend');
          this.reservationService.cancelReservation(); // Actualizar estado local
        },
        error: (error) => {
          console.error('❌ Error cancelando reserva:', error);
          alert('Error al cancelar la reserva. Intenta de nuevo.');
        }
      });
    }
  }
}

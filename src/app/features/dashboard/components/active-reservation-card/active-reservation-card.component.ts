// src/app/features/dashboard/components/active-reservation-card/active-reservation-card.component.ts

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
  readonly Math = Math;

  private intervalId: any;
  remainingTime = signal<number>(0);

  // ✅ Indicador de si la reserva ya comenzó
  hasStarted = computed(() => {
    const res = this.reservation();
    if (!res) return false;
    return new Date().getTime() >= new Date(res.startTime).getTime();
  });

  progressPercentage = computed(() => {
    const total = 30 * 60; // 30 minutos
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

  // ✅ Formato de fecha legible
  formattedDate = computed(() => {
    const res = this.reservation();
    if (!res) return '';

    const date = new Date(res.startTime);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  // ✅ Formato de hora legible
  formattedStartTime = computed(() => {
    const res = this.reservation();
    if (!res) return '';

    const date = new Date(res.startTime);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  });

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startCountdown(): void {
    this.updateRemainingTime();

    this.intervalId = setInterval(() => {
      this.updateRemainingTime();
      if (this.remainingTime() <= 0) clearInterval(this.intervalId);
    }, 1000);
  }

  private updateRemainingTime(): void {
    const res = this.reservation();
    if (!res) {
      this.remainingTime.set(0);
      return;
    }

    const now = Date.now();
    const startTime = new Date(res.startTime).getTime();
    const deadline = startTime + (30 * 60 * 1000); // 30 minutos después del inicio

    // ✅ Solo cuenta si ya empezó la reserva
    if (now < startTime) {
      this.remainingTime.set(30 * 60); // 30 minutos completos
      return;
    }

    const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
    this.remainingTime.set(remaining);
  }

  onCancelReservation(): void {
    if (confirm('¿Estás seguro de cancelar tu reserva?')) {
      const res = this.reservation();
      if (!res) return;

      this.reservationService.cancelReservationHttp(res.id, 'Cancelado por el usuario').subscribe({
        next: () => {
          console.log('✅ Reserva cancelada');
          this.reservationService.cancelReservation();
        },
        error: (error) => {
          console.error('❌ Error cancelando reserva:', error);
          alert('Error al cancelar la reserva. Intenta de nuevo.');
        }
      });
    }
  }
}

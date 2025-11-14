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
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
      this.reservationService.cancelReservation();
    }
  }
}

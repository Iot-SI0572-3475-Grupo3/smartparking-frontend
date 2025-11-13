// src/app/features/dashboard/components/active-session-card/active-session-card.component.ts

import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-active-session-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-session-card.component.html',
  styleUrls: ['./active-session-card.component.scss']
})
export class ActiveSessionCardComponent {
  session = this.reservationService.activeSession;

  formattedElapsedTime = computed(() => {
    const session = this.session();
    if (!session) return '00:00:00';

    const totalSeconds = session.elapsedTime;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  startTime = computed(() => {
    const session = this.session();
    if (!session) return '';
    return session.startedAt.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  });

  constructor(private reservationService: ReservationService) {}

  onEndSession(): void {
    if (confirm('¿Estás seguro de finalizar tu sesión de estacionamiento?')) {
      this.reservationService.endSession();
    }
  }
}

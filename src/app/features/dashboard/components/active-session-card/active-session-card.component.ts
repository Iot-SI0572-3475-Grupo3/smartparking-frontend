import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-active-session-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-session-card.component.html',
  styleUrls: ['./active-session-card.component.scss']
})
export class ActiveSessionCardComponent implements OnInit, OnDestroy {
  session = this.reservationService.activeSession;

  private intervalId: any;

  // ✅ Tiempo transcurrido formateado (HH:MM:SS)
  formattedElapsedTime = computed(() => {
    const session = this.session();
    if (!session) return '00:00:00';

    const totalSeconds = session.elapsedTime;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  // ✅ Hora de inicio formateada
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

  ngOnInit(): void {
    // ✅ Iniciar cronómetro
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ✅ Cronómetro que incrementa cada segundo
  private startTimer(): void {
    this.intervalId = setInterval(() => {
      const currentSession = this.session();
      if (currentSession) {
        // El cronómetro se actualiza automáticamente en el servicio
      }
    }, 1000);
  }

  onEndSession(): void {
    if (confirm('¿Estás seguro de finalizar tu sesión de estacionamiento?')) {
      this.reservationService.endSession();
    }
  }
}

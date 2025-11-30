// src/app/features/dashboard/components/test-controls/test-controls.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-test-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-purple-500 z-50">
  <h3 class="font-bold text-sm mb-3 text-purple-600">🧪 Testing Controls</h3>
  <div class="flex flex-col gap-2">
    <button
      (click)="simulateArrival()"
      class="px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600">
      ✅ Simular Llegada (Backend)
    </button>
    <button
      (click)="simulateExit()"
      class="px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600">
      🚗 Simular Salida (Backend)
    </button>
    <button
      (click)="resetAll()"
      class="px-3 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
      🔄 Reset Todo (Backend)
    </button>
  </div>
</div>
  `
})
export class TestControlsComponent {
  constructor(private reservationService: ReservationService) {}

  simulateArrival(): void {
    // ✅ Obtener reserva activa
    this.reservationService.getActiveReservationHttp().subscribe({
      next: (reservation) => {
        if (!reservation || !reservation.reservationId) {
          alert('⚠️ No hay reserva activa para activar');
          return;
        }

        console.log('📋 Reserva encontrada:', reservation);

        // ✅ Verificar que esté confirmada O pendiente
        if (reservation.status !== 'confirmed' && reservation.status !== 'pending') {
          alert(`⚠️ La reserva debe estar confirmada o pendiente. Estado actual: ${reservation.status}`);
          return;
        }

        // ✅ Activar reserva
        this.reservationService.activateReservationHttp(reservation.reservationId).subscribe({
          next: (response) => {
            console.log('✅ Llegada simulada - Sesión iniciada:', response);
            alert('✅ Llegada simulada exitosamente');

            // ✅ Recargar datos
            setTimeout(() => {
              this.reservationService.loadParkingSpaces();
              this.reservationService.loadActiveReservation();
            }, 500);
          },
          error: (error) => {
            console.error('❌ Error activando reserva:', error);
            alert('❌ Error al simular llegada: ' + (error.error?.message || 'Intenta de nuevo'));
          }
        });
      },
      error: (error) => {
        if (error.status === 204) {
          alert('⚠️ No hay reserva activa');
        } else {
          console.error('❌ Error obteniendo reserva activa:', error);
          alert('❌ Error al obtener reserva activa');
        }
      }
    });
  }

  simulateExit(): void {
    const session = this.reservationService.activeSession();

    if (!session) {
      alert('⚠️ No hay sesión activa para finalizar');
      return;
    }

    if (!confirm('¿Estás seguro de finalizar la sesión?')) {
      return;
    }

    this.reservationService.completeReservationHttp(session.reservationId).subscribe({
      next: () => {
        console.log('✅ Salida simulada - Sesión finalizada');
        alert('✅ Salida simulada exitosamente');

        setTimeout(() => {
          this.reservationService.loadParkingSpaces();
          this.reservationService.loadActiveReservation();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Error completando reserva:', error);

        // ✅ Mostrar mensaje específico
        const errorMsg = error.error?.message || error.message || 'Error desconocido';
        alert(`❌ Error al simular salida: ${errorMsg}`);
      }
    });
  }

  resetAll(): void {
    this.reservationService.cancelReservation();
    this.reservationService.endSession();

    setTimeout(() => {
      this.reservationService.loadParkingSpaces();
      this.reservationService.loadActiveReservation();
    }, 500);

    console.log('🔄 Sistema reseteado (solo estado local)');
    alert('🔄 Estado local reseteado');
  }
}

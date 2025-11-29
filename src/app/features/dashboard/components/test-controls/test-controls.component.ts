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
    // ✅ Primero obtener la reserva activa del backend
    this.reservationService.getActiveReservationHttp().subscribe({
      next: (reservation) => {
        if (!reservation || !reservation.reservationId) {
          alert('⚠️ No hay reserva activa para activar');
          return;
        }

        // ✅ Activar en backend
        this.reservationService.activateReservationHttp(reservation.reservationId).subscribe({
          next: () => {
            console.log('✅ Llegada simulada - Sesión iniciada en backend');
            this.reservationService.confirmArrival(); // Actualizar estado local
          },
          error: (error) => {
            console.error('❌ Error activando reserva:', error);
            alert('Error al simular llegada');
          }
        });
      },
      error: (error) => {
        if (error.status === 204) {
          alert('⚠️ No hay reserva activa');
        } else {
          console.error('❌ Error obteniendo reserva activa:', error);
        }
      }
    });
  }

  simulateExit(): void {
    // ✅ Primero obtener la reserva activa
    this.reservationService.getActiveReservationHttp().subscribe({
      next: (reservation) => {
        if (!reservation || !reservation.reservationId) {
          alert('⚠️ No hay sesión activa para finalizar');
          return;
        }

        // ✅ Completar en backend
        this.reservationService.completeReservationHttp(reservation.reservationId).subscribe({
          next: () => {
            console.log('✅ Salida simulada - Sesión finalizada en backend');
            this.reservationService.endSession(); // Actualizar estado local
          },
          error: (error) => {
            console.error('❌ Error completando reserva:', error);
            alert('Error al simular salida');
          }
        });
      },
      error: (error) => {
        console.error('❌ Error obteniendo reserva activa:', error);
      }
    });
  }

  resetAll(): void {
    this.reservationService.cancelReservation();
    this.reservationService.endSession();
    console.log('🔄 Sistema reseteado (solo estado local)');
  }
}

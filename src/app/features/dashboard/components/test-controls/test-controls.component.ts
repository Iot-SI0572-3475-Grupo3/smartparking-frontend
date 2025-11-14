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
          ✅ Simular Llegada
        </button>
        <button
          (click)="simulateExit()"
          class="px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600">
          🚗 Simular Salida
        </button>
        <button
          (click)="resetAll()"
          class="px-3 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
          🔄 Reset Todo
        </button>
      </div>
    </div>
  `
})
export class TestControlsComponent {
  constructor(private reservationService: ReservationService) {}

  simulateArrival(): void {
    this.reservationService.confirmArrival();
    console.log('✅ Llegada simulada - Sesión iniciada');
  }

  simulateExit(): void {
    this.reservationService.endSession();
    console.log('🚗 Salida simulada - Sesión finalizada');
  }

  resetAll(): void {
    this.reservationService.cancelReservation();
    this.reservationService.endSession();
    console.log('🔄 Sistema reseteado');
  }
}

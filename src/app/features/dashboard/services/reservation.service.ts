// src/app/features/dashboard/services/reservation.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { Reservation, ActiveSession, ParkingSpace, MOCK_PARKING_SPACES } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  // Signals para manejo reactivo de estado
  private parkingSpacesSignal = signal<ParkingSpace[]>(MOCK_PARKING_SPACES);
  private activeReservationSignal = signal<Reservation | null>(null);
  private activeSessionSignal = signal<ActiveSession | null>(null);

  // Computed signals (valores derivados)
  parkingSpaces = this.parkingSpacesSignal.asReadonly();
  activeReservation = this.activeReservationSignal.asReadonly();
  activeSession = this.activeSessionSignal.asReadonly();

  hasActiveReservation = computed(() => this.activeReservationSignal() !== null);
  hasActiveSession = computed(() => this.activeSessionSignal() !== null);

  /**
   * Crear una nueva reserva
   */
  createReservation(spaceId: string, date: Date, startTime: string): Reservation {
    const space = this.parkingSpacesSignal().find(s => s.id === spaceId);
    if (!space) throw new Error('Espacio no encontrado');

    const now = new Date();
    const arrivalDeadline = new Date(now.getTime() + 30 * 60 * 1000); // +30 minutos

    const reservation: Reservation = {
      id: this.generateId(),
      userId: 'current-user-id', // En producción vendría del AuthService
      spaceId: space.id,
      spaceName: space.name,
      date,
      startTime,
      createdAt: now,
      arrivalDeadline,
      status: 'pending'
    };

    // Actualizar estado
    this.activeReservationSignal.set(reservation);
    this.updateSpaceStatus(spaceId, 'reserved');

    // Simular auto-cancelación después de 30 minutos
    this.scheduleAutoCancel(reservation);

    return reservation;
  }

  /**
   * Confirmar llegada (iniciar sesión)
   */
  confirmArrival(): void {
    const reservation = this.activeReservationSignal();
    if (!reservation) return;

    const session: ActiveSession = {
      id: this.generateId(),
      reservationId: reservation.id,
      spaceId: reservation.spaceId,
      spaceName: reservation.spaceName,
      startedAt: new Date(),
      elapsedTime: 0
    };

    this.activeSessionSignal.set(session);
    this.activeReservationSignal.set(null);
    this.updateSpaceStatus(reservation.spaceId, 'occupied');

    // Iniciar cronómetro
    this.startSessionTimer();
  }

  /**
   * Cancelar reserva manualmente
   */
  cancelReservation(): void {
    const reservation = this.activeReservationSignal();
    if (!reservation) return;

    this.updateSpaceStatus(reservation.spaceId, 'available');
    this.activeReservationSignal.set(null);
  }

  /**
   * Finalizar sesión (salir del estacionamiento)
   */
  endSession(): void {
    const session = this.activeSessionSignal();
    if (!session) return;

    this.updateSpaceStatus(session.spaceId, 'available');
    this.activeSessionSignal.set(null);

    // Aquí se guardaría en el historial
    console.log('Sesión finalizada:', session);
  }

  /**
   * Obtener espacios disponibles
   */
  getAvailableSpaces(): ParkingSpace[] {
    return this.parkingSpacesSignal().filter(s => s.status === 'available');
  }

  /**
   * Actualizar estado de un espacio
   */
  private updateSpaceStatus(spaceId: string, status: ParkingSpace['status']): void {
    this.parkingSpacesSignal.update(spaces =>
      spaces.map(space =>
        space.id === spaceId ? { ...space, status } : space
      )
    );
  }

  /**
   * Programar auto-cancelación de reserva
   */
  private scheduleAutoCancel(reservation: Reservation): void {
    setTimeout(() => {
      const current = this.activeReservationSignal();
      if (current?.id === reservation.id) {
        console.log('⚠️ Reserva auto-cancelada por tiempo excedido');
        this.cancelReservation();
      }
    }, 30 * 60 * 1000); // 30 minutos
  }

  /**
   * Iniciar cronómetro de sesión activa
   */
  private startSessionTimer(): void {
    const intervalId = setInterval(() => {
      this.activeSessionSignal.update(session => {
        if (!session) {
          clearInterval(intervalId);
          return null;
        }
        const elapsed = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);
        return { ...session, elapsedTime: elapsed };
      });
    }, 1000);
  }

  /**
   * Generar ID único (mock)
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

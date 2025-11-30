import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reservation, ActiveSession, ParkingSpace, MOCK_PARKING_SPACES } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  // === PROPIEDADES PARA HTTP ===
  private basepath: string = `${environment.apiUrl}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

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

  constructor(private http: HttpClient) {}

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

  // ========================================
  // === MÉTODOS HTTP PARA BACKEND API ===
  // ========================================

  /**
   * POST /api/v1/reservation
   * Crea una nueva reserva en el backend
   */
  createReservationHttp(request: {
    spaceId: string;
    userId: string;
    startTime: string; // ISO 8601 format
    vehicleInfo?: string;
    specialRequirements?: string;
  }): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation`,
      request,
      this.httpOptions
    );
  }

  /**
   * POST /api/v1/reservation/{reservationId}/confirm
   * Confirma una reserva pendiente
   */
  confirmReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/confirm`,
      {},
      this.httpOptions
    );
  }

  /**
   * POST /api/v1/reservation/{reservationId}/cancel
   * Cancela una reserva activa
   */
  cancelReservationHttp(reservationId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/cancel`,
      { reason },
      this.httpOptions
    );
  }

  /**
   * GET /api/v1/reservation/active
   * Obtiene la reserva activa del usuario
   */
  getActiveReservationHttp(): Observable<any> {
    return this.http.get(
      `${this.basepath}/reservation/active`,
      this.httpOptions
    );
  }

  /**
   * GET /api/v1/reservation/history
   * Obtiene el historial de reservas del usuario
   */
  getReservationHistoryHttp(): Observable<any> {
    return this.http.get(
      `${this.basepath}/reservation/history`,
      this.httpOptions
    );
  }

  /**
   * POST /api/v1/reservation/{reservationId}/activate
   * Activa una reserva confirmada (usuario llega)
   */
  activateReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/activate`,
      {},
      this.httpOptions
    );
  }

  /**
   * POST /api/v1/reservation/{reservationId}/complete
   * Completa una reserva activa (usuario sale)
   */
  completeReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/complete`,
      {},
      this.httpOptions
    );
  }
}

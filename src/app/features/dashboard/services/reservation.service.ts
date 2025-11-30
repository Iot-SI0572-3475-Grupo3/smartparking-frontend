import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Reservation, ActiveSession, ParkingSpace } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private basepath: string = `${environment.apiUrl}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // ✅ Signals reactivos para el estado
  private parkingSpacesSignal = signal<ParkingSpace[]>([]);
  private activeReservationSignal = signal<Reservation | null>(null);
  private activeSessionSignal = signal<ActiveSession | null>(null);

  // ✅ Readonly signals para componentes
  parkingSpaces = this.parkingSpacesSignal.asReadonly();
  activeReservation = this.activeReservationSignal.asReadonly();
  activeSession = this.activeSessionSignal.asReadonly();

  hasActiveReservation = computed(() => this.activeReservationSignal() !== null);
  hasActiveSession = computed(() => this.activeSessionSignal() !== null);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // ===== NUEVO: Cargar datos iniciales =====
  private loadInitialData(): void {
    this.loadParkingSpaces();
    this.loadActiveReservation();
  }

  // ===== NUEVO: Cargar espacios desde backend =====
  loadParkingSpaces(): void {
    this.http.get<any[]>(`${this.basepath}/space-iot/parking-spaces`, this.httpOptions)
      .subscribe({
        next: (spaces) => {
          const mapped = spaces.map(s => ({
            id: s.spaceId,
            name: `Espacio ${s.code}`,
            code: s.code,
            status: this.mapBackendStatus(s.status)
          }));
          this.parkingSpacesSignal.set(mapped);
          console.log('✅ Espacios cargados:', mapped);
        },
        error: (err) => console.error('❌ Error cargando espacios:', err)
      });
  }

  // ===== NUEVO: Mapear estados del backend =====
  private mapBackendStatus(backendStatus: string): ParkingSpace['status'] {
    const statusMap: Record<string, ParkingSpace['status']> = {
      'available': 'available',
      'reserved': 'reserved',
      'occupied': 'occupied',
      'maintenance': 'maintenance'
    };
    return statusMap[backendStatus.toLowerCase()] || 'available';
  }

  // ===== NUEVO: Cargar reserva activa =====
  loadActiveReservation(): void {
    this.http.get<any>(`${this.basepath}/reservation/active`, this.httpOptions)
      .subscribe({
        next: (response) => {
          if (response) {
            const reservation: Reservation = {
              id: response.reservationId,
              userId: response.userId,
              spaceId: response.spaceCode,
              spaceName: `Espacio ${response.spaceCode}`,
              date: new Date(response.date),
              startTime: response.startTime,
              createdAt: new Date(response.createdAt),
              arrivalDeadline: new Date(new Date(response.startTime).getTime() + 30 * 60 * 1000),
              status: response.status as Reservation['status']
            };

            // ✅ Detectar si es sesión activa (status = 'active')
            if (reservation.status === 'active') {
              // ✅ Buscar ArrivalEvent para obtener la hora exacta de llegada
              this.getArrivalTime(reservation.id).subscribe({
                next: (arrivalTime) => {
                  const session: ActiveSession = {
                    id: reservation.id,
                    reservationId: reservation.id,
                    spaceId: reservation.spaceId,
                    spaceName: reservation.spaceName,
                    startedAt: arrivalTime || new Date(response.startTime),
                    elapsedTime: 0
                  };
                  this.activeSessionSignal.set(session);
                  this.activeReservationSignal.set(null);
                  this.startSessionTimer();
                },
                error: () => {
                  // En caso de error con la búsqueda del evento de llegada, usar startTime como fallback
                  const session: ActiveSession = {
                    id: reservation.id,
                    reservationId: reservation.id,
                    spaceId: reservation.spaceId,
                    spaceName: reservation.spaceName,
                    startedAt: new Date(response.startTime),
                    elapsedTime: 0
                  };
                  this.activeSessionSignal.set(session);
                  this.activeReservationSignal.set(null);
                  this.startSessionTimer();
                }
              });
            } else {
              this.activeReservationSignal.set(reservation);
            }

            console.log('✅ Reserva/Sesión activa cargada:', reservation);
          } else {
            this.activeReservationSignal.set(null);
            this.activeSessionSignal.set(null);
          }
        },
        error: (err) => {
          if (err && err.status === 204) {
            console.log('ℹ️ No hay reserva activa');
          } else {
            console.error('❌ Error cargando reserva activa:', err);
          }
        }
      });
  }

  // ===== ACTUALIZADO: Crear reserva con recarga automática =====
  createReservationHttp(request: any): Observable<any> {
    return this.http.post(`${this.basepath}/reservation`, request, this.httpOptions)
      .pipe(
        tap(() => {
          // ✅ Recargar datos tras crear reserva
          setTimeout(() => {
            this.loadParkingSpaces();
            this.loadActiveReservation();
          }, 500);
        })
      );
  }

  // ===== ACTUALIZADO: Confirmar reserva con recarga =====
  confirmReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/confirm`,
      {},
      this.httpOptions
    ).pipe(
      tap(() => {
        setTimeout(() => {
          this.loadParkingSpaces();
          this.loadActiveReservation();
        }, 500);
      })
    );
  }

  // ===== ACTUALIZADO: Activar reserva con recarga =====
  activateReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/activate`,
      {},
      this.httpOptions
    ).pipe(
      tap(() => {
        setTimeout(() => {
          this.loadParkingSpaces();
          this.loadActiveReservation();
        }, 500);
      })
    );
  }

  // ===== ACTUALIZADO: Completar reserva con recarga =====
  completeReservationHttp(reservationId: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/complete`,
      {},
      this.httpOptions
    ).pipe(
      tap(() => {
        setTimeout(() => {
          this.loadParkingSpaces();
          this.loadActiveReservation();
        }, 500);
      })
    );
  }

  // ===== ACTUALIZADO: Cancelar reserva con recarga =====
  cancelReservationHttp(reservationId: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.basepath}/reservation/${reservationId}/cancel`,
      { reason },
      this.httpOptions
    ).pipe(
      tap(() => {
        setTimeout(() => {
          this.loadParkingSpaces();
          this.loadActiveReservation();
        }, 500);
      })
    );
  }

  // ===== Método auxiliar: Confirmar llegada (local) =====
  confirmArrival(): void {
    const reservation = this.activeReservationSignal();
    if (!reservation) return;

    const session: ActiveSession = {
      id: reservation.id,
      reservationId: reservation.id,
      spaceId: reservation.spaceId,
      spaceName: reservation.spaceName,
      startedAt: new Date(), // ✅ Hora exacta de inicio
      elapsedTime: 0 // ✅ Empezar en 0
    };

    this.activeSessionSignal.set(session);
    this.activeReservationSignal.set(null);
    this.startSessionTimer();
  }

  // ===== Método auxiliar: Cancelar reserva (local) =====
  cancelReservation(): void {
    this.activeReservationSignal.set(null);
  }

  // ===== Método auxiliar: Finalizar sesión (local) =====
  endSession(): void {
    this.activeSessionSignal.set(null);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // ===== Cronómetro de sesión =====
  private intervalId: any;

  private startSessionTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.activeSessionSignal.update(session => {
        if (!session) {
          clearInterval(this.intervalId);
          this.intervalId = null;
          return null;
        }

        // ✅ Calcular tiempo transcurrido desde startedAt
        const elapsed = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);

        return { ...session, elapsedTime: elapsed };
      });
    }, 1000);
  }

  // ===== Obtener espacios disponibles =====
  getAvailableSpaces(): ParkingSpace[] {
    return this.parkingSpacesSignal().filter(s => s.status === 'available');
  }

  // ===== Historial de reservas (backend) =====
  getReservationHistoryHttp(): Observable<any> {
    return this.http.get(`${this.basepath}/reservation/history`, this.httpOptions);
  }

  // ===== Reserva activa (backend) =====
  getActiveReservationHttp(): Observable<any> {
    return this.http.get(`${this.basepath}/reservation/active`, this.httpOptions);
  }

  // ✅ Nuevo método para obtener hora de llegada
  private getArrivalTime(reservationId: string): Observable<Date | null> {
    return this.http.get<any>(`${this.basepath}/arrival-event/${reservationId}`, this.httpOptions)
      .pipe(
        map(event => event ? new Date(event.timestamp) : null),
        catchError(() => of(null))
      );
  }
}

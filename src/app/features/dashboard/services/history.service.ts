import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HistoryRecord {
  id: string;
  space: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string; // ✅ Nuevo campo
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private basepath: string = `${environment.apiUrl}`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener historial desde el backend
   */
  getAllHistory(): Observable<HistoryRecord[]> {
    return this.http.get<any[]>(`${this.basepath}/reservation/history`, this.httpOptions)
      .pipe(
        map(reservations => reservations.map(r => this.mapToHistoryRecord(r)))
      );
  }

  /**
   * Obtener últimas N reservas
   */
  getRecentHistory(limit: number): Observable<HistoryRecord[]> {
    return this.getAllHistory().pipe(
      map(records => records.slice(0, limit))
    );
  }

  /**
   * Mapear respuesta del backend a HistoryRecord
   */
  private mapToHistoryRecord(reservation: any): HistoryRecord {
    const startDate = new Date(reservation.startTime);
    const endDate = reservation.endTime ? new Date(reservation.endTime) : null;

    return {
      id: reservation.reservationId,
      space: `Espacio ${reservation.spaceCode}`,
      date: this.formatDate(startDate),
      startTime: this.formatTime(startDate),
      endTime: endDate ? this.formatTime(endDate) : '-',
      status: reservation.status // ✅ completed, cancelled, expired
    };
  }

  /**
   * Formatear fecha: "29 de noviembre"
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  }

  /**
   * Formatear hora: "17:00"
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Total de registros
   */
  getTotalRecords(): Observable<number> {
    return this.getAllHistory().pipe(
      map(records => records.length)
    );
  }
}

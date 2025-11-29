import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interfaces para la respuesta del dashboard
export interface DashboardResponse {
  availableSpaces: ParkingSpaceResponse[];
  recentSessions: SessionResponse[];
  absenceCount: number;
  canReserve: boolean;
}

export interface ParkingSpaceResponse {
  spaceId: string;
  code: string;
  status: string;
  currentReservationId?: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface SessionResponse {
  spaceCode: string;
  date: string;
  start: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  basepath: string = `${environment.apiUrl}`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {}

  /**
   * GET /api/v1/reservation/dashboard
   * Obtiene el dashboard del usuario autenticado
   */
  getUserDashboard(): Observable<DashboardResponse> {
    return this.httpClient.get<DashboardResponse>(
      `${this.basepath}/reservation/dashboard`,
      this.httpOptions
    );
  }
}

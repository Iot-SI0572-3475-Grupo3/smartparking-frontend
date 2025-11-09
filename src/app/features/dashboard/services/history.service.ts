import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface HistoryRecord {
  id: string;
  space: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  // Fake API - Base de datos simulada
  private historyRecords: HistoryRecord[] = [
    {
      id: '1',
      space: 'Espacio A',
      date: '15/05/2025',
      startTime: '8:00',
      endTime: '12:00'
    },
    {
      id: '2',
      space: 'Espacio B',
      date: '10/05/2025',
      startTime: '14:00',
      endTime: '16:00'
    },
    {
      id: '3',
      space: 'Espacio C',
      date: '05/05/2025',
      startTime: '09:00',
      endTime: '11:00'
    },
    {
      id: '4',
      space: 'Espacio D',
      date: '01/05/2025',
      startTime: '09:00',
      endTime: '11:00'
    },
    {
      id: '5',
      space: 'Espacio B',
      date: '30/04/2025',
      startTime: '10:00',
      endTime: '19:00'
    },
    {
      id: '6',
      space: 'Espacio A',
      date: '25/04/2025',
      startTime: '07:00',
      endTime: '09:00'
    },
    {
      id: '7',
      space: 'Espacio C',
      date: '20/04/2025',
      startTime: '09:00',
      endTime: '12:00'
    },
    {
      id: '8',
      space: 'Espacio A',
      date: '18/04/2025',
      startTime: '13:00',
      endTime: '15:00'
    },
    {
      id: '9',
      space: 'Espacio B',
      date: '15/04/2025',
      startTime: '08:00',
      endTime: '10:00'
    },
    {
      id: '10',
      space: 'Espacio C',
      date: '12/04/2025',
      startTime: '11:00',
      endTime: '14:00'
    },
    {
      id: '11',
      space: 'Espacio D',
      date: '10/04/2025',
      startTime: '16:00',
      endTime: '18:00'
    },
    {
      id: '12',
      space: 'Espacio A',
      date: '08/04/2025',
      startTime: '09:00',
      endTime: '11:00'
    },
    {
      id: '13',
      space: 'Espacio B',
      date: '05/04/2025',
      startTime: '14:00',
      endTime: '17:00'
    },
    {
      id: '14',
      space: 'Espacio C',
      date: '03/04/2025',
      startTime: '08:00',
      endTime: '10:00'
    },
    {
      id: '15',
      space: 'Espacio D',
      date: '01/04/2025',
      startTime: '12:00',
      endTime: '15:00'
    }
  ];

  constructor() { }

  /**
   * Obtener todos los registros del historial
   * Simula una llamada HTTP con delay
   */
  getAllHistory(): Observable<HistoryRecord[]> {
    // Simula delay de red de 500ms
    return of(this.historyRecords).pipe(
      delay(500)
    );
  }

  /**
   * Obtener los últimos N registros del historial
   * @param limit - Número de registros a obtener
   */
  getRecentHistory(limit: number): Observable<HistoryRecord[]> {
    const recentRecords = this.historyRecords.slice(0, limit);
    return of(recentRecords).pipe(
      delay(500)
    );
  }

  /**
   * Obtener un registro específico por ID
   * @param id - ID del registro
   */
  getHistoryById(id: string): Observable<HistoryRecord | undefined> {
    const record = this.historyRecords.find(r => r.id === id);
    return of(record).pipe(
      delay(500)
    );
  }

  /**
   * Obtener el total de registros
   */
  getTotalRecords(): number {
    return this.historyRecords.length;
  }
}

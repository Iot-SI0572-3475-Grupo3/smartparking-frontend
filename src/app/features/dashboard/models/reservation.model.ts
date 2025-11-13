// src/app/features/dashboard/models/reservation.model.ts

export type ReservationStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type SpaceStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface ParkingSpace {
  id: string;
  name: string;
  code: string; // A, B, C, D
  status: SpaceStatus;
}

export interface Reservation {
  id: string;
  userId: string;
  spaceId: string;
  spaceName: string;
  date: Date;
  startTime: string; // HH:mm format
  createdAt: Date;
  arrivalDeadline: Date; // 30 minutos desde createdAt
  status: ReservationStatus;
}

export interface ActiveSession {
  id: string;
  reservationId: string;
  spaceId: string;
  spaceName: string;
  startedAt: Date;
  elapsedTime: number; // en segundos
}

export const MOCK_PARKING_SPACES: ParkingSpace[] = [
  { id: '1', name: 'Espacio A', code: 'A', status: 'available' },
  { id: '2', name: 'Espacio B', code: 'B', status: 'available' },
  { id: '3', name: 'Espacio C', code: 'C', status: 'available' },
  { id: '4', name: 'Espacio D', code: 'D', status: 'available' },
];

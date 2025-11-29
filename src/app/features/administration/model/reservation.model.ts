export interface ReservationModel {
  reservationId: string;
  spaceCode: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  status: string;
  vehicleInfo: string;
  specialRequirements: string;
  totalCost: number;
  completedAt: Date;
  cancelledAt: Date;
  cancellationReason: string;
}

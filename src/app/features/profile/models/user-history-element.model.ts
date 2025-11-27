export interface UserHistoryElement {
  reservationId: string,
  spaceCode: string,
  startTime: string,
  endTime: string,
  date: string,
  status: string,
  vehicleInfo: string,
  specialRequirements: string,
  totalCost: number,
  completedAt: string,
  cancelledAt: string,
  cancellationReason: string
}

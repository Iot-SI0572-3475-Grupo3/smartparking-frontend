export interface ParkingSpaceModel {
  spaceId: string;
  code: string;
  status: string;
  currentReservationId?: string;
  lastUpdated: Date;
  createdAt: Date;

}

export interface ReservationHistory {
  id: string;
  space: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const MOCK_RESERVATION_HISTORY: ReservationHistory[] = [
  {
    id: '1',
    space: 'Sótano 01 - A1',
    date: '15/05/2025',
    startTime: '08:00',
    endTime: '12:00'
  },
  {
    id: '2',
    space: 'Sótano 02 - B5',
    date: '10/05/2025',
    startTime: '14:00',
    endTime: '16:00'
  },
  {
    id: '3',
    space: 'Sótano 03 - C2',
    date: '05/05/2025',
    startTime: '09:00',
    endTime: '11:00'
  },
  {
    id: '4',
    space: 'Sótano 03 - C4',
    date: '01/05/2025',
    startTime: '09:00',
    endTime: '11:00'
  },
  {
    id: '5',
    space: 'Sótano 02 - B2',
    date: '30/04/2025',
    startTime: '10:00',
    endTime: '19:00'
  },
  {
    id: '6',
    space: 'Sótano 01 - A5',
    date: '25/04/2025',
    startTime: '07:00',
    endTime: '09:00'
  },
  {
    id: '7',
    space: 'Sótano 03 - C2',
    date: '20/04/2025',
    startTime: '09:00',
    endTime: '12:00'
  },
  {
    id: '8',
    space: 'Sótano 01 - A3',
    date: '18/04/2025',
    startTime: '13:00',
    endTime: '15:00'
  },
  {
    id: '9',
    space: 'Sótano 02 - B1',
    date: '15/04/2025',
    startTime: '08:00',
    endTime: '10:00'
  },
  {
    id: '10',
    space: 'Sótano 03 - C5',
    date: '12/04/2025',
    startTime: '11:00',
    endTime: '14:00'
  }
];

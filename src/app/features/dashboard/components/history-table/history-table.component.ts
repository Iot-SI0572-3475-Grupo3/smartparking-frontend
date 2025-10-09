import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HistoryRecord {
  id: string;
  space: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss'
})
export class HistoryTableComponent {
  @Input() showViewAllLink: boolean = true;
  @Input() maxRecords: number = 4; // Mostrar solo 4 registros por defecto
  
  @Output() viewAllClicked = new EventEmitter<void>();
  @Output() recordClicked = new EventEmitter<HistoryRecord>();

  // Datos de ejemplo del historial
  historyRecords: HistoryRecord[] = [
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
    }
  ];

  // Obtener registros limitados para mostrar
  get displayRecords(): HistoryRecord[] {
    return this.historyRecords.slice(0, this.maxRecords);
  }

  // Manejar click en "Ver historial completo"
  onViewAllClick() {
    this.viewAllClicked.emit();
  }

  // Manejar click en un registro
  onRecordClick(record: HistoryRecord) {
    this.recordClicked.emit(record);
  }
}
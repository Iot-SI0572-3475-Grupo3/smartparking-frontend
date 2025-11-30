import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryRecord } from '../../services/history.service';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss']
})
export class HistoryTableComponent implements OnInit {
  @Input() maxRecords: number = 5;
  @Input() showViewAllLink: boolean = true;

  @Output() viewAllClicked = new EventEmitter<void>();
  @Output() recordClicked = new EventEmitter<HistoryRecord>();

  displayRecords: HistoryRecord[] = [];
  isLoading: boolean = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;

    this.historyService.getRecentHistory(this.maxRecords).subscribe({
      next: (records) => {
        this.displayRecords = records;
        this.isLoading = false;
        console.log('✅ Historial cargado:', records);
      },
      error: (error) => {
        console.error('❌ Error cargando historial:', error);
        this.isLoading = false;
        this.displayRecords = [];
      }
    });
  }

  // ✅ Extrae solo el código del espacio (sin "Espacio")
  getSpaceCode(spaceName: string): string {
    return spaceName.replace('Espacio ', '');
  }

  // ✅ Retorna el texto del estado en español
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'expired': 'Ausencia'
    };
    return statusMap[status] || status;
  }

  // ✅ Retorna clases CSS según el estado
  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'completed': 'text-device-available font-semibold',
      'cancelled': 'text-device-maintenance font-semibold',
      'expired': 'text-device-occupied font-semibold'
    };
    return classMap[status] || 'text-text-muted';
  }

  onRecordClick(record: HistoryRecord): void {
    this.recordClicked.emit(record);
  }

  onViewAllClick(): void {
    this.viewAllClicked.emit();
  }
}

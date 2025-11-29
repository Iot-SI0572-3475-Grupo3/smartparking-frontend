import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service'; // ✅ CAMBIAR IMPORT

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.scss'
})
export class HistoryTableComponent implements OnInit {
  @Input() showViewAllLink: boolean = true;
  @Input() maxRecords: number = 4;

  @Output() viewAllClicked = new EventEmitter<void>();
  @Output() recordClicked = new EventEmitter<any>();

  historyRecords: any[] = [];
  isLoading = true;

  constructor(private reservationService: ReservationService) {} // ✅ CAMBIAR SERVICIO

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;

    // ✅ LLAMAR AL BACKEND
    this.reservationService.getReservationHistoryHttp().subscribe({
      next: (records) => {
        this.historyRecords = records.slice(0, this.maxRecords); // Limitar según maxRecords
        this.isLoading = false;
        console.log('✅ Historial cargado desde backend:', records);
      },
      error: (error) => {
        console.error('❌ Error loading history:', error);
        this.isLoading = false;
      }
    });
  }

  get displayRecords(): any[] {
    return this.historyRecords;
  }

  onViewAllClick() {
    this.viewAllClicked.emit();
  }

  onRecordClick(record: any) {
    this.recordClicked.emit(record);
  }
}

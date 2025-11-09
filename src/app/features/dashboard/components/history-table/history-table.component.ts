import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryRecord } from '../../../dashboard/services/history.service';

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
  @Output() recordClicked = new EventEmitter<HistoryRecord>();

  historyRecords: HistoryRecord[] = [];
  isLoading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.historyService.getRecentHistory(this.maxRecords).subscribe({
      next: (records) => {
        this.historyRecords = records;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.isLoading = false;
      }
    });
  }

  get displayRecords(): HistoryRecord[] {
    return this.historyRecords;
  }

  onViewAllClick() {
    this.viewAllClicked.emit();
  }

  onRecordClick(record: HistoryRecord) {
    this.recordClicked.emit(record);
  }
}

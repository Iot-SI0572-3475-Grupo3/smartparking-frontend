import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryRecord } from '../../../dashboard/services/history.service';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements OnInit {
  reservations: HistoryRecord[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pages: number[] = [];
  isLoading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.historyService.getAllHistory().subscribe({
      next: (records) => {
        // ✅ Ordenar por más reciente primero
        this.reservations = records.sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.startTime);
          const dateB = new Date(b.date + ' ' + b.startTime);
          return dateB.getTime() - dateA.getTime();
        });
        this.calculatePagination();
        this.isLoading = false;
        console.log('✅ Historial completo cargado:', records);
      },
      error: (error) => {
        console.error('❌ Error cargando historial completo:', error);
        this.isLoading = false;
      }
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.reservations.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedReservations(): HistoryRecord[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.reservations.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // ✅ Extrae solo el código del espacio
  getSpaceCode(spaceName: string): string {
    return spaceName.replace('Espacio ', '');
  }

  // ✅ Texto del estado
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'expired': 'Ausencia'
    };
    return statusMap[status] || status;
  }

  // ✅ Clases CSS del estado
  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'completed': 'text-device-available font-semibold',
      'cancelled': 'text-device-maintenance font-semibold',
      'expired': 'text-device-occupied font-semibold'
    };
    return classMap[status] || 'text-text-muted';
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages + 2) {
      return this.pages;
    }

    pages.push(1);

    if (this.currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
      pages.push(i);
    }

    if (this.currentPage < this.totalPages - 2) {
      pages.push('...');
    }

    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return pages;
  }
}

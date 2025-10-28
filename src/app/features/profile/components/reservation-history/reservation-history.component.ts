import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationHistory, MOCK_RESERVATION_HISTORY } from '../../models/reservation-history.model';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-history.component.html',
  styleUrl: './reservation-history.component.scss'
})
export class ReservationHistoryComponent implements OnInit {
  reservations: ReservationHistory[] = [];
  currentPage = 1;
  itemsPerPage = 7;
  totalPages = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadReservations();
    this.calculatePagination();
  }

  loadReservations(): void {
    // Simula carga desde servicio
    this.reservations = MOCK_RESERVATION_HISTORY;
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.reservations.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedReservations(): ReservationHistory[] {
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

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages + 2) {
      // Mostrar todas las páginas si son pocas
      return this.pages;
    }

    // Siempre mostrar la primera página
    pages.push(1);

    if (this.currentPage > 3) {
      pages.push('...');
    }

    // Mostrar páginas alrededor de la actual
    for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
      pages.push(i);
    }

    if (this.currentPage < this.totalPages - 2) {
      pages.push('...');
    }

    // Siempre mostrar la última página
    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return pages;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalty-first-absence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-first-absence.component.html',
  styleUrl: './penalty-first-absence.component.scss'
})
export class PenaltyFirstAbsenceComponent {
  isModalOpen = true; // Mostrar el modal por defecto

  closeModal() {
    this.isModalOpen = false;
  }

  viewDetails() {
    // Lógica para ver detalles, por ahora solo cerrar el modal
    this.closeModal();
  }
}

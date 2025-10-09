import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalty-second-absence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-second-absence.component.html',
  styleUrl: './penalty-second-absence.component.scss'
})
export class PenaltySecondAbsenceComponent {
  isModalOpen = true; // Mostrar el modal por defecto

  closeModal() {
    this.isModalOpen = false;
  }

  viewPolicy() {
    // Lógica para ver política, por ahora solo cerrar el modal
    this.closeModal();
  }
}

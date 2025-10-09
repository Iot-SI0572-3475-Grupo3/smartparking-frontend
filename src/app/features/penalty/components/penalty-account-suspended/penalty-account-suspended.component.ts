import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalty-account-suspended',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-account-suspended.component.html',
  styleUrl: './penalty-account-suspended.component.scss'
})
export class PenaltyAccountSuspendedComponent {
  isModalOpen = true; // Mostrar el modal por defecto

  closeModal() {
    this.isModalOpen = false;
  }

  understood() {
    // Lógica para entendido, por ahora solo cerrar el modal
    this.closeModal();
  }
}

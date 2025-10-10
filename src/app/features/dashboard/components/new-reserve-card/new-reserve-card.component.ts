import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-reserve-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-reserve-card.component.html',
  styleUrl: './new-reserve-card.component.scss'
})
export class NewReserveCardComponent {
  @Input() disabled: boolean = false;
  
  @Output() reserveClicked = new EventEmitter<void>();

  // Manejar click en el botón de reservar
  onReserveClick() {
    if (!this.disabled) {
      this.reserveClicked.emit();
    }
  }
}
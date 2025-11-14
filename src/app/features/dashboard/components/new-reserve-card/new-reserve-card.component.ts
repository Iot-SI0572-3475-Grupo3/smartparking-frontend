// src/app/features/dashboard/components/new-reserve-card/new-reserve-card.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/button/button.component";

@Component({
  selector: 'app-new-reserve-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './new-reserve-card.component.html',
  styleUrls: ['./new-reserve-card.component.scss']
})
export class NewReserveCardComponent {
  @Input() disabled = false;
  @Output() reserveClicked = new EventEmitter<void>();

  onReserveClick(): void {
    if (!this.disabled) {
      this.reserveClicked.emit();
    }
  }
}

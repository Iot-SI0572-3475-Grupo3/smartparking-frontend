import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewReserveOverlayComponent } from '../new-reserve-overlay/new-reserve-overlay.component';
import {ButtonComponent} from "../../../../shared/button/button.component";

@Component({
  selector: 'app-new-reserve-card',
  standalone: true,
  imports: [CommonModule, NewReserveOverlayComponent, ButtonComponent],
  templateUrl: './new-reserve-card.component.html',
  styleUrls: ['./new-reserve-card.component.scss']
})
export class NewReserveCardComponent {
  @Input() disabled = false;
  @Output() reserveClicked = new EventEmitter<void>();

  showOverlay = false;

  onReserveClick(): void {
    if (!this.disabled) {
      this.showOverlay = true;
    }
  }
}

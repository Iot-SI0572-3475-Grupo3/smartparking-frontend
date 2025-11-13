import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-new-reserve-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-reserve-overlay.component.html',
  styleUrls: ['./new-reserve-overlay.component.scss']
})
export class NewReserveOverlayComponent {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.isVisible = false;
    this.closed.emit();
  }

}

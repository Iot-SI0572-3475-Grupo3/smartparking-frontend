import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpaceStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface SpaceCardData {
  id: string;
  name: string;
  status: SpaceStatus;
  location?: string;
  type?: string;
}

@Component({
  selector: 'app-space-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-card.component.html',
  styleUrl: './space-card.component.scss'
})
export class SpaceCardComponent {
  @Input() space!: SpaceCardData;

  // Mapeo de estados a colores y textos
  get statusConfig() {
    const configs = {
      available: {
        text: 'Libre',
        bgColor: 'bg-device-available/10',
        textColor: 'text-device-available'
      },
      occupied: {
        text: 'Ocupado',
        bgColor: 'bg-device-occupied/10',
        textColor: 'text-device-occupied'
      },
      maintenance: {
        text: 'Mantenimiento',
        bgColor: 'bg-device-maintenance/10',
        textColor: 'text-device-maintenance'
      },
      reserved: {
        text: 'Reservado',
        bgColor: 'bg-button-primary/10',
        textColor: 'text-button-primary'
      }
    };
    
    return configs[this.space.status] || configs.available;
  }

}
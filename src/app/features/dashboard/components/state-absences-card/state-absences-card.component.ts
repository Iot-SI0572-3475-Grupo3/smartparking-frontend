import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-absences-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-absences-card.component.html',
  styleUrl: './state-absences-card.component.scss'
})
export class StateAbsencesCardComponent {
  @Input() absencesCount: number = 0;
}
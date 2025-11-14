import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { ParkingSpace } from '../../models/reservation.model';

@Component({
  selector: 'app-reserve-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserve-modal.component.html',
  styleUrls: ['./reserve-modal.component.scss']
})
export class ReserveModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() reservationCreated = new EventEmitter<void>();

  reserveForm!: FormGroup;
  availableSpaces: ParkingSpace[] = [];
  showSuccessModal = false;
  reservationSummary: any = null;

  // Fechas límite
  minDate: string = '';
  maxDate: string = '';
  minTime: string = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.calculateDateLimits();
    this.initializeForm();
    this.loadAvailableSpaces();
  }

  /**
   * Calcular límites de fecha y hora
   */
  private calculateDateLimits(): void {
    const now = new Date();

    // Fecha mínima: HOY
    this.minDate = this.formatDateForInput(now);

    // Fecha máxima: 24 horas desde ahora
    const maxDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    this.maxDate = this.formatDateForInput(maxDateTime);

    // Hora mínima: Ahora + 30 minutos
    const minDateTime = new Date(now.getTime() + 30 * 60 * 1000);
    this.minTime = this.formatTimeForInput(minDateTime);
  }

  /**
   * Inicializar formulario con validaciones
   */
  private initializeForm(): void {
    const now = new Date();
    const defaultDateTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 min

    this.reserveForm = this.fb.group({
      date: [this.formatDateForInput(defaultDateTime), [Validators.required]],
      startTime: [this.formatTimeForInput(defaultDateTime), [Validators.required]],
      spaceId: ['', Validators.required]
    }, {
      validators: [this.dateTimeValidator.bind(this)]
    });

    // Listener para actualizar hora mínima cuando cambia la fecha
    this.reserveForm.get('date')?.valueChanges.subscribe(() => {
      this.updateMinTime();
    });
  }

  /**
   * Validador personalizado de fecha y hora
   */
  private dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const date = control.get('date')?.value;
    const startTime = control.get('startTime')?.value;

    if (!date || !startTime) return null;

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${startTime}`);
    const minDateTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 min
    const maxDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 horas

    // Validar que sea al menos 30 minutos en el futuro
    if (selectedDateTime < minDateTime) {
      return { tooSoon: true };
    }

    // Validar que no exceda 24 horas
    if (selectedDateTime > maxDateTime) {
      return { tooFar: true };
    }

    return null;
  }

  /**
   * Actualizar hora mínima según la fecha seleccionada
   */
  private updateMinTime(): void {
    const selectedDate = this.reserveForm.get('date')?.value;
    if (!selectedDate) return;

    const now = new Date();
    const todayStr = this.formatDateForInput(now);

    if (selectedDate === todayStr) {
      // Si es HOY, hora mínima = ahora + 30 min
      const minDateTime = new Date(now.getTime() + 30 * 60 * 1000);
      this.minTime = this.formatTimeForInput(minDateTime);
    } else {
      // Si es MAÑANA, hora mínima = 00:00
      this.minTime = '00:00';
    }

    // Revalidar el formulario
    this.reserveForm.updateValueAndValidity();
  }

  /**
   * Formatear fecha para input type="date"
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formatear hora para input type="time"
   */
  private formatTimeForInput(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private loadAvailableSpaces(): void {
    this.availableSpaces = this.reservationService.getAvailableSpaces();
  }

  onSubmit(): void {
    if (this.reserveForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const { date, startTime, spaceId } = this.reserveForm.value;
    const reservation = this.reservationService.createReservation(
      spaceId,
      new Date(date),
      startTime
    );

    // ✅ CALCULAR LA HORA LÍMITE (hora de inicio + 30 minutos)
    const [hours, minutes] = startTime.split(':').map(Number);
    const deadlineDate = new Date(date);
    deadlineDate.setHours(hours, minutes + 30);

    // Preparar resumen
    this.reservationSummary = {
      space: reservation.spaceName,
      date: this.formatDate(reservation.date),
      time: reservation.startTime,
      deadline: this.formatTime(deadlineDate) // ✅ Usar la hora calculada
    };

    // Mostrar modal de éxito
    this.showSuccessModal = true;
  }

  onAcceptSuccess(): void {
    this.showSuccessModal = false;
    this.reservationCreated.emit();
    this.close();
  }

  close(): void {
    this.reserveForm.reset();
    this.showSuccessModal = false;
    this.calculateDateLimits(); // Recalcular límites al cerrar
    this.initializeForm(); // Reinicializar formulario
    this.closed.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reserveForm.controls).forEach(key => {
      this.reserveForm.get(key)?.markAsTouched();
    });
  }

  private formatDate(date: Date): string {
    // ✅ FIX: Usar toLocaleDateString con la zona horaria correcta
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      timeZone: 'America/Lima' // O tu zona horaria
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  get selectedSpaceName(): string {
    const spaceId = this.reserveForm.get('spaceId')?.value;
    return this.availableSpaces.find(s => s.id === spaceId)?.name || '';
  }

  /**
   * Mensajes de error personalizados
   */
  getDateTimeError(): string {
    if (this.reserveForm.errors?.['tooSoon']) {
      return 'Debes reservar con al menos 30 minutos de anticipación';
    }
    if (this.reserveForm.errors?.['tooFar']) {
      return 'Solo puedes reservar con hasta 24 horas de anticipación';
    }
    return '';
  }

  /**
   * Verificar si hay error de fecha/hora
   */
  hasDateTimeError(): boolean {
    // Coerce possible undefined values to boolean to satisfy TypeScript's strictness.
    const errors = this.reserveForm.errors;
    const hasDateTimeErrors = Boolean(errors?.['tooSoon'] || errors?.['tooFar']);
    const touched = Boolean(this.reserveForm.get('date')?.touched || this.reserveForm.get('startTime')?.touched);
    return hasDateTimeErrors && touched;
  }
}

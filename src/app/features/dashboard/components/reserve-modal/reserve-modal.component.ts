import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
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
  isLoading = false;

  // Fechas límite
  minDate: string = '';
  maxDate: string = ''; // ← Ya no se usará para validación
  minTime: string = '';

  // Usuario actual
  private currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.calculateDateLimits();
    this.initializeForm();
    this.loadAvailableSpaces();
    this.getCurrentUserId();
  }

  /**
   * Obtener el userId del usuario autenticado
   */
  private getCurrentUserId(): void {
    this.authService.currentUserId.subscribe(
      (userId: string) => {
        this.currentUserId = userId;
        console.log('🔑 Current User ID:', this.currentUserId);
      }
    );
  }

  /**
   * Calcular límites de fecha y hora
   */
  private calculateDateLimits(): void {
    const now = new Date();

    // Fecha mínima: HOY
    this.minDate = this.formatDateForInput(now);

    // ✅ ELIMINADO: Ya no hay límite máximo de 24 horas
    // Se puede reservar cualquier fecha futura

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
   * Validador personalizado de fecha y hora (SIN LÍMITE DE 24 HORAS)
   */
  private dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const date = control.get('date')?.value;
    const startTime = control.get('startTime')?.value;

    if (!date || !startTime) return null;

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${startTime}`);
    const minDateTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 min

    // Validar que sea al menos 30 minutos en el futuro
    if (selectedDateTime < minDateTime) {
      return { tooSoon: true };
    }

    // ✅ ELIMINADO: Validación de máximo 24 horas
    // Ya no hay límite máximo

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
      // Si es MAÑANA o después, hora mínima = 00:00
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

    if (!this.currentUserId) {
      alert('❌ Error: No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    this.isLoading = true;

    const { date, startTime, spaceId } = this.reserveForm.value;

    // Construir el request para el backend
    const request = {
      spaceId: spaceId,
      userId: this.currentUserId,
      startTime: `${date}T${startTime}:00`, // ISO 8601 format
      vehicleInfo: JSON.stringify({ plate: 'ABC123', color: 'Rojo' }), // Ejemplo - podrías agregar campos al formulario
      specialRequirements: 'Cerca de la entrada' // Ejemplo - podrías agregar campos al formulario
    };

    console.log('📤 Enviando reserva al backend:', request);

    // Llamar al backend para crear la reserva
    this.reservationService.createReservationHttp(request).subscribe({
      next: (response) => {
        console.log('✅ Reserva creada exitosamente:', response);
        this.isLoading = false;

        // ✅ CALCULAR LA HORA LÍMITE (hora de inicio + 30 minutos)
        const [hours, minutes] = startTime.split(':').map(Number);
        const deadlineDate = new Date(date);
        deadlineDate.setHours(hours, minutes + 30);

        // Preparar resumen usando los datos del backend
        this.reservationSummary = {
          space: response.spaceCode,
          date: this.formatDate(new Date(response.date)),
          time: response.startTime.substring(11, 16), // Extraer HH:mm
          deadline: this.formatTime(deadlineDate)
        };

        // Mostrar modal de éxito
        this.showSuccessModal = true;
      },
      error: (error) => {
        console.error('❌ Error creando reserva:', error);
        this.isLoading = false;

        // Manejar diferentes tipos de errores
        if (error.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else if (error.status === 409) {
          alert('⚠️ El espacio ya está reservado. Por favor, selecciona otro.');
        } else if (error.error?.message) {
          alert(`Error: ${error.error.message}`);
        } else {
          alert('Error al crear la reserva. Por favor, intenta de nuevo.');
        }
      }
    });
  }

  onAcceptSuccess(): void {
    this.showSuccessModal = false;
    this.reservationCreated.emit();
    this.close();
  }

  close(): void {
    this.reserveForm.reset();
    this.showSuccessModal = false;
    this.isLoading = false;
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
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      timeZone: 'America/Lima'
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
   * Mensajes de error personalizados (SIN LÍMITE DE 24 HORAS)
   */
  getDateTimeError(): string {
    if (this.reserveForm.errors?.['tooSoon']) {
      return 'Debes reservar con al menos 30 minutos de anticipación';
    }
    // ✅ ELIMINADO: Mensaje de error "tooFar"
    return '';
  }

  /**
   * Verificar si hay error de fecha/hora
   */
  hasDateTimeError(): boolean {
    const errors = this.reserveForm.errors;
    const hasDateTimeErrors = Boolean(errors?.['tooSoon']); // ✅ Solo valida "tooSoon"
    const touched = Boolean(this.reserveForm.get('date')?.touched || this.reserveForm.get('startTime')?.touched);
    return hasDateTimeErrors && touched;
  }
}

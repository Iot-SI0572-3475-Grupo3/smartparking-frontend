import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';
import { ParkingSpaceService } from '../../../../services/parking-space.service';

interface ParkingSpace {
  spaceId: string;
  code: string;
  status: string;
}

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
  isLoadingSpaces = false;

  minDate: string = '';
  minTime: string = '';
  timeOptions: string[] = [];

  private currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private authService: AuthenticationService,
    private parkingSpaceService: ParkingSpaceService
  ) {}

  ngOnInit(): void {
    this.calculateDateLimits();
    this.generateTimeOptions();
    this.initializeForm();
    this.getCurrentUserId();

    // ✅ CARGAR ESPACIOS INMEDIATAMENTE AL ABRIR EL MODAL
    console.log('🚀 Modal inicializado, cargando espacios...');
    setTimeout(() => {
      this.loadAvailableSpaces();
    }, 100);
  }

  /**
   * Genera opciones de tiempo en múltiplos de 15 minutos
   */
  private generateTimeOptions(): void {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        this.timeOptions.push(timeString);
      }
    }
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
    this.minDate = this.formatDateForInput(now);

    // Hora mínima: Ahora + 30 minutos, redondeado al siguiente múltiplo de 15
    const minDateTime = new Date(now.getTime() + 30 * 60 * 1000);
    this.minTime = this.roundToNext15Minutes(minDateTime);
  }

  /**
   * Redondear al siguiente múltiplo de 15 minutos
   */
  private roundToNext15Minutes(date: Date): string {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;

    if (roundedMinutes >= 60) {
      date.setHours(date.getHours() + 1);
      date.setMinutes(0);
    } else {
      date.setMinutes(roundedMinutes);
    }

    return this.formatTimeForInput(date);
  }

  /**
   * Inicializar formulario con validaciones
   */
  private initializeForm(): void {
    const now = new Date();
    const defaultDateTime = new Date(now.getTime() + 30 * 60 * 1000);

    this.reserveForm = this.fb.group({
      date: [this.formatDateForInput(defaultDateTime), [Validators.required]],
      startTime: [this.roundToNext15Minutes(defaultDateTime), [Validators.required]],
      spaceId: ['', Validators.required]
    }, {
      validators: [this.dateTimeValidator.bind(this)]
    });

    // Listener para cargar espacios cuando cambie fecha/hora
    this.reserveForm.get('date')?.valueChanges.subscribe(() => {
      this.updateMinTime();
      this.loadAvailableSpaces();
    });

    this.reserveForm.get('startTime')?.valueChanges.subscribe(() => {
      this.loadAvailableSpaces();
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
    const minDateTime = new Date(now.getTime() + 30 * 60 * 1000);

    if (selectedDateTime < minDateTime) {
      return { tooSoon: true };
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
      const minDateTime = new Date(now.getTime() + 30 * 60 * 1000);
      this.minTime = this.roundToNext15Minutes(minDateTime);
    } else {
      this.minTime = '00:00';
    }

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

  /**
   * Cargar espacios disponibles desde el backend
   */
  loadAvailableSpaces(): void {
    const date = this.reserveForm.get('date')?.value;
    const time = this.reserveForm.get('startTime')?.value;

    console.log('🔍 loadAvailableSpaces llamado:', { date, time });

    if (!date || !time) {
      console.log('⚠️ Fecha u hora no seleccionadas, limpiando espacios');
      this.availableSpaces = [];
      return;
    }

    this.isLoadingSpaces = true;
    console.log('📡 Llamando a getParkingSpaceByStatus("available")...');

    // Llamar al servicio para obtener espacios con status "available"
    this.parkingSpaceService.getParkingSpaceByStatus('available').subscribe({
      next: (spaces) => {
        console.log('✅ Espacios recibidos del backend:', spaces);
        console.log('📊 Cantidad de espacios:', spaces?.length);

        this.availableSpaces = spaces.map(space => ({
          spaceId: space.spaceId,
          code: space.code,
          status: space.status
        }));

        console.log('✅ Espacios mapeados:', this.availableSpaces);
        this.isLoadingSpaces = false;
      },
      error: (error) => {
        console.error('❌ Error cargando espacios:', error);
        console.error('❌ Status del error:', error.status);
        console.error('❌ Mensaje del error:', error.message);
        this.availableSpaces = [];
        this.isLoadingSpaces = false;
        alert('Error al cargar espacios disponibles. Intenta de nuevo.');
      }
    });
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
      startTime: `${date}T${startTime}:00`,
      vehicleInfo: '', // String vacío como solicitaste
      specialRequirements: '' // String vacío como solicitaste
    };

    console.log('📤 Enviando reserva al backend:', request);

    // Llamar al backend para crear la reserva
    this.reservationService.createReservationHttp(request).subscribe({
      next: (response) => {
        console.log('✅ Reserva creada exitosamente:', response);
        this.isLoading = false;

        // Calcular la hora límite (hora de inicio + 30 minutos)
        const [hours, minutes] = startTime.split(':').map(Number);
        const deadlineDate = new Date(date);
        deadlineDate.setHours(hours, minutes + 30);

        // Preparar resumen usando los datos del backend
        const selectedSpace = this.availableSpaces.find(s => s.spaceId === spaceId);

        this.reservationSummary = {
          space: selectedSpace?.code || response.spaceCode,
          date: this.formatDate(new Date(response.date)),
          time: response.startTime.substring(11, 16),
          deadline: this.formatTime(deadlineDate)
        };

        // Mostrar modal de éxito
        this.showSuccessModal = true;
      },
      error: (error) => {
        console.error('❌ Error creando reserva:', error);
        this.isLoading = false;

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
    this.availableSpaces = [];
    this.calculateDateLimits();
    this.initializeForm();
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
    return this.availableSpaces.find(s => s.spaceId === spaceId)?.code || '';
  }

  getDateTimeError(): string {
    if (this.reserveForm.errors?.['tooSoon']) {
      return 'Debes reservar con al menos 30 minutos de anticipación';
    }
    return '';
  }

  hasDateTimeError(): boolean {
    const errors = this.reserveForm.errors;
    const hasDateTimeErrors = Boolean(errors?.['tooSoon']);
    const touched = Boolean(this.reserveForm.get('date')?.touched || this.reserveForm.get('startTime')?.touched);
    return hasDateTimeErrors && touched;
  }
}

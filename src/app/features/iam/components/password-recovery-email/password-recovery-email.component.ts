import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-recovery-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password-recovery-email.component.html',
  styleUrl: './password-recovery-email.component.scss'
})
export class PasswordRecoveryEmailComponent implements OnInit {
  recoveryForm!: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Manejar envío del formulario
  onSubmit() {
    if (this.recoveryForm.valid) {
      this.isLoading = true;
      const email = this.recoveryForm.get('email')?.value;
      
      console.log('Enviando email de recuperación a:', email);
      
      // Simular llamada a API
      setTimeout(() => {
        this.isLoading = false;
        this.emailSent = true;
        console.log('Email de recuperación enviado exitosamente');
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched() {
    Object.keys(this.recoveryForm.controls).forEach(key => {
      const control = this.recoveryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter para acceder fácilmente al control del formulario
  get email() { return this.recoveryForm.get('email'); }

  // Verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.recoveryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtener mensaje de error para un campo
  getErrorMessage(fieldName: string): string {
    const field = this.recoveryForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'Email es requerido';
    }
    
    if (field?.errors?.['email']) {
      return 'Por favor ingresa un email válido';
    }
    
    return '';
  }

  // Reiniciar el formulario para enviar otro email
  resetForm() {
    this.emailSent = false;
    this.recoveryForm.reset();
  }
}
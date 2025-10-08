import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-recovery-newpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './password-recovery-newpassword.component.html',
  styleUrl: './password-recovery-newpassword.component.scss'
})
export class PasswordRecoveryNewpasswordComponent implements OnInit {
  newPasswordForm!: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  passwordUpdated = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar contraseña
  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Toggle para mostrar/ocultar nueva contraseña
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  // Toggle para mostrar/ocultar confirmación de contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Manejar envío del formulario
  onSubmit() {
    if (this.newPasswordForm.valid) {
      this.isLoading = true;
      const formData = this.newPasswordForm.value;
      
      console.log('Actualizando contraseña:', formData);
      
      // Simular llamada a API
      setTimeout(() => {
        this.isLoading = false;
        this.passwordUpdated = true;
        console.log('Contraseña actualizada exitosamente');
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched() {
    Object.keys(this.newPasswordForm.controls).forEach(key => {
      const control = this.newPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get newPassword() { return this.newPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.newPasswordForm.get('confirmPassword'); }

  // Verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.newPasswordForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Verificar si hay error de confirmación de contraseña
  hasPasswordMismatchError(): boolean {
    return !!(this.newPasswordForm.errors?.['passwordMismatch'] && 
              this.confirmPassword?.touched);
  }

  // Obtener mensaje de error para un campo
  getErrorMessage(fieldName: string): string {
    const field = this.newPasswordForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    
    if (field?.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Confirmar contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}

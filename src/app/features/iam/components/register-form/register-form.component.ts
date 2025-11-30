import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ButtonComponent} from "../../../../shared/button/button.component";
import {AuthenticationService} from "../../services/authentication.service";
import {SignUpRequest} from "../../model/sign-up.request";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar contraseña
  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Toggle para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle para mostrar/ocultar confirmación de contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Manejar envío del formulario
  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      const request: SignUpRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }


      console.log('Datos del registro:', formData);

      if (formData.role === 'university_member') {
        this.authService.signUpUniversityMember(request);
      }
      else if (formData.role === 'administrator') {
        this.authService.signUpAdmin(request);
      }

      // Simular llamada a API
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }

  // Verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Verificar si hay error de confirmación de contraseña
  hasPasswordMismatchError(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] &&
              this.confirmPassword?.touched);
  }

  // Obtener mensaje de error para un campo
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (field?.errors?.['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }

    if (field?.errors?.['email']) {
      return 'Por favor ingresa un email válido';
    }

    if (field?.errors?.['minlength']) {
      if (fieldName === 'firstName' || fieldName === 'lastName') {
        return 'El nombre debe tener al menos 2 caracteres';
      }
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (field?.errors?.['requiredTrue'] && fieldName === 'acceptTerms') {
      return 'Debes aceptar los términos y condiciones';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}

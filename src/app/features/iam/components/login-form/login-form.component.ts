import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Toggle para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Manejar envío del formulario
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formData = this.loginForm.value;
      
      console.log('Datos del login:', formData);
      
      // Simular llamada a API
      setTimeout(() => {
        this.isLoading = false;
        // Aquí iría la lógica de autenticación
        console.log('Login exitoso');
        // Navegar al dashboard después del login exitoso
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  // Verificar si un campo tiene error
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Obtener mensaje de error para un campo
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    
    if (field?.errors?.['email']) {
      return 'Por favor ingresa un email válido';
    }
    
    if (field?.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent],
  template: `
    <app-register-form></app-register-form>
  `,
  styles: []
})
export class RegisterPageComponent {}

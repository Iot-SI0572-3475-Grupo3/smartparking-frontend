import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smartparking-frontend';
  
  // Rutas donde NO mostrar el navbar
  private authRoutes = ['/login', '/register', '/password-recovery', '/password-recovery/new-password'];
  
  constructor(private router: Router) {}
  
  showNavbar(): boolean {
    const currentUrl = this.router.url;
    return !this.authRoutes.some(route => currentUrl.startsWith(route));
  }
}

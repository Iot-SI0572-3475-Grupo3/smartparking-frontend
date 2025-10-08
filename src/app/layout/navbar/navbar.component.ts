import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  // Estado del menú móvil
  isMobileMenuOpen = false;

  // Navegación del navbar
  navItems = [
    { label: 'Inicio', route: '/dashboard' },
    { label: 'Reservas', route: '/reservations' },
    { label: 'Historial', route: '/history' },
    { label: 'Perfil', route: '/profile' }
  ];

  // Método para manejar clics en navegación
  onNavClick(route: string) {
    // Aquí podrías agregar lógica adicional si es necesario
    console.log('Navegando a:', route);
  }

  // Toggle del menú móvil
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Cerrar menú móvil
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}

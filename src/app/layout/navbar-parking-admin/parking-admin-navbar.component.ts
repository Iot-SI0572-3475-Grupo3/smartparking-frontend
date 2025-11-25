import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parking-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './parking-admin-navbar.component.html',
  styleUrl: './parking-admin-navbar.component.scss'
})
export class ParkingAdminNavbarComponent {
  // Estado del menú móvil
  isMobileMenuOpen = false;

  // Navegación del navbar
  navItems = [
    { label: 'Inicio', route: '/admin/dashboard' },
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

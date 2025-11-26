import { Component } from '@angular/core';
import {ParkingAdminNavbarComponent} from "../../../../layout/navbar-parking-admin/parking-admin-navbar.component";

@Component({
  selector: 'app-parking-admin-dashboard',
  standalone: true,
  imports: [
    ParkingAdminNavbarComponent
  ],
  templateUrl: './parking-admin-dashboard.component.html',
  styleUrl: './parking-admin-dashboard.component.scss'
})
export class ParkingAdminDashboardComponent {

}

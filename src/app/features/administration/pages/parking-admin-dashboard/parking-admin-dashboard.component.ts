import {Component, OnInit} from '@angular/core';
import {ReservationModel} from "../../model/reservation.model";
import {AdminDashboardService} from "../../services/admin.dashboard.service";
import {UserModel} from "../../model/user.model";
import {UserService} from "../../services/user.service";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ParkingSpaceService} from "../../../../services/parking-space.service";
import {ParkingSpaceModel} from "../../../../services/model/parking-space.model";
import {FormsModule} from "@angular/forms";
import {ParkingSpaceRequest} from "../../../../services/model/parking-space.request";

@Component({
  selector: 'app-parking-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgFor, NgIf, FormsModule],
  templateUrl: './parking-admin-dashboard.component.html',
  styleUrl: './parking-admin-dashboard.component.scss'
})
export class ParkingAdminDashboardComponent implements OnInit {
  ReservationList: ReservationModel[] = [];
  UserList: UserModel[] = [];
  ParkingSpacesList: ParkingSpaceModel[] = [];
  selectedUser: UserModel | undefined;
  newParkingSpace: ParkingSpaceRequest | undefined;

  overlayOpen = false;
  addOverlayOpen = false;

  suspendedUsers = 0;
  occupiedSpaces = 0;
  reservedSpaces = 0;
  maintenanceSpaces = 0;
  newSpacesCount = 0;

  ngOnInit(): void {
    this.parkingSpaceService.getParkingSpaceByStatus('reserved')
      .subscribe({
      next: (res: ParkingSpaceModel[]) => {
        console.log('Reserved spaces:', res);
        this.reservedSpaces = res.length;
        }
      })
    this.parkingSpaceService.getParkingSpaceByStatus('occupied')
      .subscribe({
          next: (res: ParkingSpaceModel[]) => {
            this.occupiedSpaces = res.length;
          }
        })
    this.parkingSpaceService.getParkingSpaceByStatus('maintenance')
      .subscribe({
          next: (res: ParkingSpaceModel[]) => {
            this.maintenanceSpaces = res.length;
          }
        })
    this.parkingSpaceService.getAllParkingSpaces()
      .subscribe({
        next:(res: ParkingSpaceModel[]) => {
          this.ParkingSpacesList = res || [];
        },
        error: (err) => {
          console.error(err);
          this.ParkingSpacesList = [];
        }
      })
    this.dashboardService.getAllReservations()
      .subscribe({
        next: (res: ReservationModel[]) => {
          this.ReservationList = res || [];
          },
        error: (err) => {
          console.error('Failed to load reservation', err);
          this.ReservationList = [];
        }
      })
    this.userService.getAllUsers()
      .subscribe({
        next: (res: UserModel[]) => {
          this.UserList = res || [];
          for(let i=0; i<this.UserList.length; i++){
            if(this.UserList[i].status == 'suspended'){
              this.suspendedUsers += 1;
            }
          }
        },
        error: (err) => {
          console.error('Failed to load user List', err);
          this.UserList = [];
          }
      })

  }

  constructor(
    private dashboardService:AdminDashboardService,
    private userService:UserService,
    private parkingSpaceService:ParkingSpaceService
  ) {
  }

  openOverlay(user: UserModel): void {
    this.selectedUser = user;
    this.overlayOpen = true;
  }

  closeOverlay(): void {
    this.overlayOpen = false;
    this.selectedUser = undefined;
  }

  openAddOverlay() {
    this.addOverlayOpen = true;
  }

  closeAddOverlay() {
    this.addOverlayOpen = false;
  }

  confirmAddSpaces() {
    if (!this.newParkingSpace) {
      this.newParkingSpace = {} as ParkingSpaceRequest;
    }
    for (let i=0; i<this.newSpacesCount; i++) {
      this.newParkingSpace.code = this.generateSpaceCode(this.ParkingSpacesList.length+i);
      this.newParkingSpace.status = 'available';
      console.log('se agrego: ', this.newParkingSpace);
      this.parkingSpaceService.postParkingSpace(this.newParkingSpace);
    }
  }

  private generateSpaceCode(n: number): string {
    return `SP-${n.toString().padStart(7, '0')}`;
  }

}

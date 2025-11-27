import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../../../shared/button/button.component";
import {InputComponent} from "../../../../shared/input/input.component";
import {FormsModule} from "@angular/forms";
import {ProfileService} from "../../services/profile.service";
import {UserProfile} from "../../models/user-profile.model";
import {AuthenticationService} from "../../../iam/services/authentication.service";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  isEditing = false;

  firstName = '';
  lastName = '';
  userStatus = this.authenticationService.currentUserStatus.toString();
  userTotalReserves = 0;
  userCanceledReserves = 0;
  userExpiredReserves = 0;

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      (response: any) => {
        this.firstName = response.firstName;
        this.lastName = response.lastName;
      });
    this.profileService.getHistory().subscribe(
      (response: any) => {
        this.userTotalReserves = response.length;
        for (let reserve of response) {
          if (reserve.status === 'cancelled') {
            this.userCanceledReserves += 1;
          }
          if (reserve.status === 'expired') {
            this.userExpiredReserves += 1;
          }
        }
      }
    )
  }

  constructor(
    private profileService: ProfileService,
    private authenticationService: AuthenticationService
  ) {
  }

  onSaveProfile() {
    this.isEditing = false;
    const payload: UserProfile = {
      firstName: this.firstName,
      lastName: this.lastName
    }
    this.profileService.putProfile(payload).subscribe(
      (response: any) => {
        console.log('Profile updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating profile', error);
      }
    )
  }
}


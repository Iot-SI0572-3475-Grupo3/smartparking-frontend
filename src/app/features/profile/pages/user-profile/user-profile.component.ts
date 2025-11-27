import { Component } from '@angular/core';
import {ButtonComponent} from "../../../../shared/button/button.component";
import {InputComponent} from "../../../../shared/input/input.component";
import {FormsModule} from "@angular/forms";


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
export class UserProfileComponent {
  isEditing = false;

  onSaveProfile() {
    this.isEditing = false;
  }
}

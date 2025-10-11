import { Component } from '@angular/core';
import {NavbarComponent} from "../../../../layout/navbar/navbar.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}

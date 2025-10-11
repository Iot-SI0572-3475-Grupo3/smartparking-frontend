import { Component } from '@angular/core';
import {NavbarComponent} from "../../../../layout/navbar/navbar.component";
import {ButtonComponent} from "../../../../shared/button/button.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    ButtonComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}

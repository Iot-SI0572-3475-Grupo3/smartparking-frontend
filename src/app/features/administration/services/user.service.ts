import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserModel} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  basepath: string = `${environment.apiUrl}`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private HttpClient: HttpClient
  ) {
  }

  getAllUsers() {
    return this.HttpClient.get<UserModel[]>(`${this.basepath}/auth/users`, this.httpOptions);
  }

}

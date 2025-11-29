import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {ReservationModel} from "../model/reservation.model";

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  basepath: string = `${environment.apiUrl}`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getAllReservations(){
    return this.http.get<ReservationModel[]>(`${this.basepath}/reservation/all-history`, this.httpOptions);
  }

}

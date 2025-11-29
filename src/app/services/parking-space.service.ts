import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ParkingSpaceModel} from "./model/parking-space.model";
import {ParkingSpaceRequest} from "./model/parking-space.request";

@Injectable({
  providedIn: 'root'
})
export class ParkingSpaceService {
  basepath: string = `${environment.apiUrl}`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  getAllParkingSpaces(){
    return this.http.get<ParkingSpaceModel[]>(`${this.basepath}/space-iot/parking-spaces`, this.httpOptions);
  }
  postParkingSpace(parkingSpaceRequest: ParkingSpaceRequest){
    return this.http.post<ParkingSpaceModel>(`${this.basepath}/space-iot/parking-spaces`, parkingSpaceRequest, this.httpOptions);
  }
  getParkingSpaceByStatus(status: string){
    return this.http.get<ParkingSpaceModel[]>(`${this.basepath}/space-iot/parking-spaces/status/${status}`, this.httpOptions);
  }
  putParkingSpace(parkingSpace: ParkingSpaceModel) {
    return this.http.put<ParkingSpaceModel>(`${this.basepath}/space-iot/parking-spaces/${parkingSpace.spaceId}`, parkingSpace, this.httpOptions);
  }




}

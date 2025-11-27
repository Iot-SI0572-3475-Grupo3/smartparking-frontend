import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../iam/services/authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserProfile} from "../models/user-profile.model";


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  basepath: string = `${environment.apiUrl}`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };


  private totalReserves = 0;
  private canceledReserves = 0;
  private expiredReserves = 0;



  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {
  }


  getProfile(){
    return this.httpClient.get(`${this.basepath}/user-profiles/${this.authenticationService.currentUserId.toString()}`, this.httpOptions)
  }

  getHistory(){
    return this.httpClient.get(`${this.basepath}/reservation/history`, this.httpOptions)
  }

  putProfile(profile: UserProfile){
    return this.httpClient.put(`${this.basepath}/user-profiles/${this.authenticationService.currentUserId.toString()}`, profile, this.httpOptions)
  }
}

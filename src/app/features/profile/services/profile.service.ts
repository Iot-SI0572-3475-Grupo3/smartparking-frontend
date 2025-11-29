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

  private userId = '';


  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {
  }


  getProfile(){
    this.authenticationService.currentUserId.subscribe(
      (id: string) => {
        this.userId = id;
      }
    );
    return this.httpClient.get(`${this.basepath}/user-profiles/${this.userId}`, this.httpOptions)
  }

  getHistory(){
    return this.httpClient.get(`${this.basepath}/reservation/history`, this.httpOptions)
  }

  putProfile(profile: UserProfile){
    this.authenticationService.currentUserId.subscribe(
      (id: string) => {
        this.userId = id;
      }
    );
    return this.httpClient.put(`${this.basepath}/user-profiles/${this.userId}`, profile, this.httpOptions)
  }
}

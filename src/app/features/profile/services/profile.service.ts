import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../iam/services/authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";


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

  constructor(
    private httpClient: HttpClient
  ) {
  }



}

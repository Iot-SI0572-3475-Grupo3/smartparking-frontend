import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {decodeJwt} from "../../../utils/jwt";

import { SignInRequest } from "../model/sign-in.request";
import { SignInResponse } from "../model/sign-in.response";
import { SignUpRequest } from "../model/sign-up.request";
import { SignUpResponse } from "../model/sign-up.response";
import {Router} from "@angular/router";
import {logOutRequest} from "../model/log-out.request";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  basePath: string = `${environment.apiUrl}`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };



  private signedIn = new BehaviorSubject<boolean>(false);
  private signedInUserId = new BehaviorSubject<string>('');
  private signedInUserRole = new BehaviorSubject<string>('');
  private signedInUserStatus = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  initSession() {
    if (typeof window === 'undefined') return; // SSR protection

    const token = localStorage.getItem('token');

    if (!token) {
      this.signedIn.next(false);
      return;
    }

    try {
      const data = decodeJwt(token);

      this.signedIn.next(true);
      this.signedInUserId.next(data.userId || data.id || data.sub || '');
      this.signedInUserRole.next(data.role);
    } catch (e) {
      console.error('Invalid token', e);
      localStorage.removeItem('token');
      this.signedIn.next(false);
    }
  }



  get isSignedIn() {
    return this.signedIn.asObservable();
  }
  get currentUserId(){
    return this.signedInUserId.asObservable();
  }

  get currentUserRole(){
    return this.signedInUserRole.asObservable();
  }

  get currentUserStatus(){
    return this.signedInUserStatus.asObservable();
  }

  getUserDataFromToken() : void{
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const data = decodeJwt(token)

      this.signedIn.next(true);
      this.signedInUserId.next(data.userId || data.id || data.sub || '');
      this.signedInUserRole.next(data.role);

    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }


  signUpAdmin(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/auth/users/register/administrator`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed up as ${response.email} with id: ${response.userId}`);
          this.router.navigate(['login']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['register']).then();
        }
      });
  }

  signUpUniversityMember(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/auth/users/register/university-member`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed up as ${response.email} with id: ${response.userId}`);
          this.router.navigate(['login']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['register']).then();
        }
      });
  }
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/auth/users/login`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {

          localStorage.setItem('token', response.token);
          this.getUserDataFromToken();
          sessionStorage.setItem('signInId', response.sessionId);

          console.log(`Signed in with token ${response.token} and id ${this.signedInUserId.value} and role ${this.signedInUserRole.value}`);
          if (this.signedInUserRole.value === 'administrator') {
            console.log('Navigating to admin dashboard');
            this.router.navigate([`admin/dashboard`]).then();
            return;
          }
          else {
            this.router.navigate([`dashboard`]).then();
            this.signedInUserStatus.next(response.status);
          }
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next('');
          this.signedInUserRole.next('');
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['login']).then();
        }
      });
  }

  logOut() {
    return this.http.post<logOutRequest>(`${this.basePath}/auth/users/logout/${sessionStorage.getItem('signInId')}`, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(false);
          this.signedInUserId.next('');
          this.signedInUserRole.next('');
          localStorage.removeItem('token');
          this.router.navigate(['login']).then();
        },
        error: (error) => {
          console.error(`Error while logging out: ${error}`);
        }
      })
  };
}

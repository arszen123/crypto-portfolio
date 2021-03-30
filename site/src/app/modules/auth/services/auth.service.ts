import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

type Credentials = { username: string, password: string };
type AuthRespose = { success: boolean, token: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  createProfile(credentials: Credentials) {
    return this.http.post(environment.api + '/auth/sign-up', credentials).pipe(map(({success, token}: AuthRespose) => {
      this.setToken(token);
      return {success};
    }));
  }

  authenticate(credentials: Credentials) {
    return this.http.post(environment.api + '/auth/sign-in', credentials).pipe(map(({success, token}: AuthRespose) => {
      this.setToken(token);
      return {success};
    }));
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
}

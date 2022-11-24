import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const AUTH_API = 'http://localhost:3000/userGestion/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(AUTH_API + 'login', {
        username: username,
        password: password,
      })
      .pipe(
        map((reponse: any) => {
          return reponse;
        })
      );
  }

  register(username: string, password: string) {
    let data = {
      username: username,
      password: password,
    };
    let url = AUTH_API + 'register';
    return this.http.post<any>(url, data).pipe(
      map((reponse: any) => {
        return reponse;
      })
    );
  }
}

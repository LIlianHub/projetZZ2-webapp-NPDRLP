import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const AUTH_API = 'http://localhost:3000/userGestion/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    let data = {
      username: username,
      password: password,
    };
    let url = AUTH_API + 'login';
    return this.http.post<any>(url, data, httpOptions).pipe(
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
    return this.http.post<any>(url, data, httpOptions).pipe(
      map((reponse: any) => {
        return reponse;
      })
    );
  }
}

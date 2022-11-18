import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParoleModele } from '../models/parole.model';

@Injectable({
  providedIn: 'root',
})
export class ParoleService {
  constructor(private http: HttpClient) {}

  getParole(artiste: string, musique: string): Observable<any> {
    return this.http.get<any>(
      'http://localhost:3000/getLyrics/' + artiste + '-' + musique
    );
  }

  getParoleTest(artiste: string, musique: string): Observable<ParoleModele> {
    return this.http.get<ParoleModele>(
      'http://localhost:3000/getsLyricsForTest/' + artiste + '-' + musique
    );
  }


}

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
      'http://localhost:3000/lyricsGestion/getLyrics/' + artiste + '-' + musique
    );
  }

  getParoleAvecTrou(
    artiste: string,
    musique: string,
    difficulty: number
  ): Observable<ParoleModele> {
    return this.http.get<ParoleModele>(
      'http://localhost:3000/lyricsGestion/getsLyricsWithHole/' +
        artiste +
        '-' +
        musique +
        '-' +
        difficulty
    );
  }

  saveParole(artiste: string, musique: string): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/lyricsGestion/saveLyrics',
      {
        artiste: artiste,
        musique: musique,
      }
    );
  }

  getUserMusicFolder(): Observable<any> {
    return this.http.get<any>(
      'http://localhost:3000/lyricsGestion/getUserMusicFolder/'
    );
  }
}

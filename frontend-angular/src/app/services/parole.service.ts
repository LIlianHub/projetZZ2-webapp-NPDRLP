import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParoleModele } from '../models/parole.model';
import { ApiMenu } from '../models/recepApi.model';



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


  getUserMusicFolder(): Observable<any> {
    return this.http.get<any>(
      'http://localhost:3000/lyricsGestion/getUserMusicFolder/'
    );
  }

  getFolderForAddMusic(): Observable<ApiMenu> {
    return this.http.get<any>(
      'http://localhost:3000/lyricsGestion/getFolderForAddMusique/'
    );
  }

  saveMusicInFolder(artiste: string, musique: string, folder: number): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/lyricsGestion/addUserMusicInFolder',
      {
        "artist": artiste,
        "title": musique,
        "folder": folder,
      }
    );
  }

  deleteMusicInFolder(idMusic: number, idFolder: number): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/lyricsGestion/deleteMusicInFolder',
      {
        "idFolder": idFolder,
        "idMusic": idMusic,
      }
    );
  }

  addUserFolder(folderName: string): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/lyricsGestion/addUserFolder',
      {
        "folderName": folderName,
      }
    );
  }

  deleteUserFolder(idFolder: number): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/lyricsGestion/deleteUserFolder',
      {
        "idFolder": idFolder
      }
    );
  }

}

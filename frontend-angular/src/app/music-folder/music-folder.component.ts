import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParoleService } from '../services/parole.service';

@Component({
  selector: 'app-music-folder',
  templateUrl: './music-folder.component.html',
  styleUrls: ['./music-folder.component.scss'],
})
export class MusicFolderComponent implements OnInit {
  constructor(private paroleService: ParoleService) {}

  dossier!: MenuItem[];
  loading: boolean = true;

  ngOnInit() {
    this.getFolders();
  }

  getFolders() {
    this.paroleService.getUserMusicFolder().subscribe(
      (reponse) => {
        this.dossier = reponse;
        this.loading = false;
        console.log(this.dossier);
      },
      (erreur) => {
        console.log(erreur.error);
      }
    );
  }
}

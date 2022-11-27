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
    this.paroleService.getUserMusicFolder().subscribe((data) => {
      this.dossier = data;
      this.loading = false;
    });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParoleService } from '../services/parole.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-music-folder',
  templateUrl: './music-folder.component.html',
  styleUrls: ['./music-folder.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class MusicFolderComponent implements OnInit {

  // type de folder souhaité
  @Input() folderType?: string;
  @Input() artiste!: string;
  @Input() musique!: string;

  dossier!: MenuItem[];
  loading: boolean = true;
  erreurMessage!: string;
  

  constructor(
    private paroleService: ParoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    switch (this.folderType) {
      case 'user':
        this.getUserFolders();
        break;
      case 'add':
        this.getAjoutFolder();
        break;
    }
  }

  // FONCTIONS DE CREATION DE DOSSIER

  getUserFolders() {
    this.paroleService.getUserMusicFolder().subscribe(
      (reponse) => {
        this.dossier = reponse;
        this.loading = false;
      },
      (erreur) => {
        this.erreurMessage = erreur.error;
        this.loading = false;
      }
    );
  }

  getAjoutFolder() {

    this.paroleService.getFolderForAddMusic().subscribe(
      (reponse) => {
        let menu: MenuItem[] = [];
        for (let i = 0; i < reponse.items.length; i++) {
          menu.push({
            label: reponse.items[i].label,
            command: (event : Event) => this.confirmSave(event, reponse.items[i].id),
          });
        }

        let bigMenu: MenuItem[] = [];
        bigMenu.push({
          label: reponse.label,
          items: menu
        });
        this.dossier = bigMenu;
        this.loading = false;

      },
      (erreur) => {
        this.erreurMessage = erreur.error;
        this.loading = false;
        console.log(this.erreurMessage);
      });
  }

  //fonction lier a sauvegarde de musique dans dossier

  confirmSave(event : Event, idFolder: number) {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as Element,
      message: 'Voulez-vous enregistrer cette musique dans votre dossier ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveSong(idFolder);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Annulé',
          detail: 'Vous avez annulé l\'enregistrement',
        });
      },
    });
  }

  saveSong(idFolder: number) {
    this.paroleService
      .saveMusicInFolder(
        this.artiste,
        this.musique,
        idFolder
      )
      .subscribe(
        (reponse) => {
          console.log(reponse);
          this.messageService.add({
            severity: 'success',
            summary: 'Succes',
            detail: reponse.message,
          });
        },
        (erreur) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: erreur.error,
          });
        }
      );
  }


}



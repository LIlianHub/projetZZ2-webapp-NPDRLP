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
        let menu: MenuItem[] = [];
        let menuMusique: MenuItem[] = [];
        for (let i = 0; i < reponse.length; i++) {
          menuMusique = [];
          for (let j = 0; j < reponse[i].items.length; j++) {
            menuMusique.push({
              label: reponse[i].items[j].label,
              routerLink: reponse[i].items[j].link,
              id: reponse[i].items[j].id.toString() + " " + reponse[i].id.toString(),
            });
          }
          menu.push({
            label: reponse[i].label,
            items: menuMusique,
            id: reponse[i].id.toString(),
          });
        }
        this.dossier = menu;
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


  onRightClick(event: Event,/*id : number*/) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    let type = 0;
    let st : any;
    console.log((event.target as HTMLElement).parentElement?.id);
    //console.log((event.target as HTMLElement).id);
    //console.log(event);
    //console.log(this.dossier);
    console.log((event.target as HTMLElement).tagName);
    if ((event.target as HTMLElement).tagName === "SPAN") { 
      type = 1;
      st = (event.target as HTMLElement).parentElement?.id;
    }
    if ((event.target as HTMLElement).tagName === "A") { 
      type = 2;
      st = (event.target as HTMLElement).id;
    }

    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as Element,
      message: 'Etes vous sure de vouloir supprimer ce dossier ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete(type,st);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Annulé',
          detail: 'Vous avez annulé la suppression',
        });
      },
    }) 
    
    console.log("here");

} 

delete(type : number , st : string){
  let ids;
  if(type == 2){
    ids = st.split("_");
    this.paroleService.deleteUserFolder(parseInt(ids[0]))
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
  if(type == 1){
    let idd;
    let idm;
    ids = st.split(" ");
    idd = ids[0];
    idm = ids[1];
    this.paroleService.deleteMusicInFolder(parseInt(idm),parseInt(idd))
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
  if(type == 0){
    console.log("erreur type");
  }
  
}


}



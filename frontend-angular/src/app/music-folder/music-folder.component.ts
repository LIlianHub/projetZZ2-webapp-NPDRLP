import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParoleService } from '../services/parole.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

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

  choiceMenu!: MenuItem[];
  activeChoiceMenu: boolean = false;
  posXChoiceMenu: number = 0;
  posYChoiceMenu: number = 0;

  activeAddFolderMenu = false;
  FormAddFolder!: FormGroup;

  activeRenameFolderMenu = false;
  RenameFolderMenu!: FormGroup;
  currentIdFolder !: number;

  saveEvent!: Event;

  constructor(
    private paroleService: ParoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private builder: FormBuilder,
  ) { }


  ngOnInit() {

    switch (this.folderType) {
      case 'user':
        this.getUserFolders();
        this.setChoiceMenuForFolder('user');
        this.FormAddFolder = this.builder.group({
          FolderName: new FormControl('', [Validators.required]),
        });
        this.RenameFolderMenu = this.builder.group({
          NewName: new FormControl('', [Validators.required]),
        });
        break;
      case 'add':
        this.getAjoutFolder();
        break;
    }
  }


  // FONCTIONS DE CHOIX

  setChoiceMenuForFolder(idInCommand: string) {
    this.choiceMenu =
      [
        {
          label: 'Supprimer',
          icon: 'pi pi-trash',
          command: () => { this.confirmFolderDelete(idInCommand) }

        },
        {
          label: 'Renommer',
          icon: 'pi pi-pencil',
          command: () => {
            this.TweakMenuRenameDossier();
            let recupIds = idInCommand.split("_");
            this.currentIdFolder = parseInt(recupIds[0]);
          },
        }
      ];
  }

  setChoiceMenuForMusic(idInCommand: string) {
    this.choiceMenu = [
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: () => { this.confirmSongDelete(idInCommand) }
      }
    ];
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
              routerLink: reponse[i].items[j].routerLink,
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
            command: (event: Event) => this.confirmSave(event, reponse.items[i].id),
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
      });
  }

  //fonction liée à la sauvegarde de musique dans dossier

  confirmSave(event: any, idFolder: number) {
    this.confirmationService.confirm({
      target: event.originalEvent.srcElement as Element,
      message: 'Voulez-vous enregistrer cette musique dans votre dossier ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveSong(idFolder);
      },
      reject: () => {
        this.callBackInfo('Vous avez annulé l\'enregistrement', 'Annulé');
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
          //console.log(reponse);
          this.callBackSuccess(reponse.message);
        },
        (erreur) => {
          this.callBackError(erreur.error);
        }
      );
  }

  // FONCTIONS DE SUPPRESSION DE DOSSIER et MUSIQUE


  confirmSongDelete(infoMusique: string) {
    this.confirmationService.confirm({
      target: this.saveEvent.target as Element,
      message: 'Etes vous sure de vouloir supprimer cette Musique ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMusique(infoMusique);
      },
      reject: () => {
        this.callBackInfo("Vous avez annulé la suppression", "Annulé");
      },
    })

  }

  deleteMusique(infoMusique: string) {
    let recupIds = infoMusique.split(" ");
    this.paroleService.deleteMusicInFolder(parseInt(recupIds[0]), parseInt(recupIds[1]))
      .subscribe(
        (reponse) => {
          //console.log(reponse);
          this.callBackSuccess(reponse.message);
          this.getUserFolders();
        },
        (erreur) => {
          this.callBackError(erreur.error);
        }
      );
  }

  confirmFolderDelete(infoFolder: string) {
    this.confirmationService.confirm({
      target: this.saveEvent.target as Element,
      message: 'Etes vous sure de vouloir supprimer ce dossier ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFolder(infoFolder);
      },
      reject: () => {
        this.callBackInfo('Vous avez annulé la suppression', "Annulé");
      },
    })
  }

  deleteFolder(infoFolder: string) {
    let recupIds = infoFolder.split("_");
    this.paroleService.deleteUserFolder(parseInt(recupIds[0]))
      .subscribe(
        (reponse) => {
          //console.log(reponse);
          this.callBackSuccess(reponse.message);
          this.getUserFolders();
        },
        (erreur) => {
          this.callBackError(erreur.error);
        }
      );
  }

  // CREATION DOSSIER

  onSubmitAjoutDossier(): void {
    this.paroleService
      .addUserFolder(this.FormAddFolder.value.FolderName)
      .subscribe(
        (reponse) => {
          this.FormAddFolder.reset();
          this.TweakMenuAjoutDossier();
          this.callBackSuccess(reponse.message);
          this.getUserFolders();
        },
        (err) => {
          this.FormAddFolder.reset();
          this.callBackError(err.error);
        }
      );
  }


  TweakMenuAjoutDossier(event?: Event): void {
    this.activeAddFolderMenu = !this.activeAddFolderMenu;
    //console.log(this.activeAddFolderMenu);
  }

  // FONCTIONS DE GESTION DES MESSAGES

  callBackError(erreurMessage: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: erreurMessage,
    });
  }

  callBackSuccess(successMessage: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Succes',
      detail: successMessage,
    });
  }

  callBackInfo(infoMessage: string, summaryInfo: string) {
    this.messageService.add({
      severity: 'info',
      summary: summaryInfo,
      detail: infoMessage,
    });
  }


  // CONTEXT MENU

  // un clic sur le document ferme le menu contextuel
  @HostListener('document:click', ['$event']) onClick(event: Event) {
    this.activeChoiceMenu = false;
  }


  onRightClick(event: Event, eventClick: MouseEvent) {
    if (this.folderType === 'user') {

      let targetId: any;

      this.posXChoiceMenu = eventClick.clientX;
      this.posYChoiceMenu = eventClick.clientY;
      this.saveEvent = event;
      if ((event.target as HTMLElement).tagName === "SPAN") {
        targetId = (event.target as HTMLElement).parentElement?.id;
        this.setChoiceMenuForMusic(targetId);
      }
      if ((event.target as HTMLElement).tagName === "A") {
        targetId = (event.target as HTMLElement).id;
        this.setChoiceMenuForFolder(targetId);
      }
      this.activeChoiceMenu = !this.activeChoiceMenu;

      event.preventDefault();
      eventClick.preventDefault();
    }
  }

  // Renommage DOSSIER

  onSubmitRenameDossier(): void {
    this.paroleService
      .renameUserFolder(this.currentIdFolder, this.RenameFolderMenu.value.NewName)
      .subscribe(
        (reponse) => {
          this.RenameFolderMenu.reset();
          this.CloseMenuRenameDossier();
          this.callBackSuccess(reponse.message);
          this.getUserFolders();
        },
        (err) => {
          this.RenameFolderMenu.reset();
          this.callBackError(err.error);
        }
      );
  }


  TweakMenuRenameDossier(event?: Event): void {
    this.activeRenameFolderMenu = !this.activeRenameFolderMenu;
  }

  CloseMenuRenameDossier(event?: Event): void {
    this.activeRenameFolderMenu = false;
    //console.log(this.activeAddFolderMenu);
  }

}
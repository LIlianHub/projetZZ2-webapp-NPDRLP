import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';
import { ParoleModele } from '../models/parole.model';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { ApiMenu } from '../models/recepApi.model';


const functions = {
  save: () => {
    console.log('Enregistrement...');
  },
  delete: () => {
    console.log('Suppression...');
  }
};


@Component({
  selector: 'app-parole',
  templateUrl: './parole.component.html',
  styleUrls: ['./parole.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService],
})
export class ParoleComponent implements OnInit {
  nosParoles!: ParoleModele;
  loading: boolean = true;
  erreur!: string;
  wordEnter: string[] = [];
  difficulte!: number;
  verifTab: boolean[] = [];
  nbMotJuste: number = 0;
  dossier!: MenuItem[];
  showDossier: boolean = false;

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.paroleService
      .getParoleAvecTrou(
        this.route.snapshot.params['artiste'],
        this.route.snapshot.params['musique'],
        this.route.snapshot.params['difficulte']
      )
      .subscribe(
        (reponse) => {
          this.nosParoles = reponse;
          this.difficulte = this.route.snapshot.params['difficulte'];
          this.initialiseTabVerif();
          this.loading = false;
        },
        (erreur) => {
          this.erreur = erreur.error;
          this.loading = false;
        }
      );
    this.paroleService.getFolderForAddMusic().subscribe((reponse) => {
      console.log(reponse);
      this.buildMenuItems(reponse);

    }
    );
  }

  onSubmit() {
    this.getAllWords();
    this.verifWords();
  }

  initialiseTabVerif() {
    for (let i = 0; i < this.nosParoles.nb_mots_manquant; i++) {
      this.verifTab.push(false);
    }
  }

  getAllWords() {
    let value;
    for (let i = 0; i < this.nosParoles.nb_mots_manquant; i++) {
      value = this.elRef.nativeElement.querySelector(
        "input[name='form_" + i + "']"
      ).value;
      this.wordEnter[i] = value.toUpperCase();
    }
  }

  verifWords() {
    this.nbMotJuste = 0;
    let target;
    for (let i = 0; i < this.nosParoles.nb_mots_manquant; i++) {
      target = this.elRef.nativeElement.querySelector(
        "input[name='form_" + i + "']"
      );
      if (this.wordEnter[i] == this.nosParoles.mots_manquant[i]) {
        this.verifTab[i] = true;
        this.nbMotJuste += 1;
        target.classList.add('mot-juste');
        target.classList.remove('mot-faux');
        target.setAttribute('disabled', true);
      } else {
        target.classList.add('mot-faux');
        this.verifTab[i] = false;
      }
    }
  }

  saveSong() {
    this.paroleService
      .saveMusicInFolder(
        this.route.snapshot.params['artiste'],
        this.route.snapshot.params['musique'],
        1
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

  menuFolder(event: Event) {
    /*this.confirmationService.confirm({
      target: event.target as Element,
      message: 'Êtes-vous sûr de vouloir sauvegarder cette chanson ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveSong();
      },
      reject: () => {
        //reject action
      },
    });*/
    this.showDossier = !this.showDossier;
  }

  ajouteMusique(id: number) {
    console.log(id);
  }



  buildMenuItems(dossierRecu: ApiMenu) {
    let menu: MenuItem[] = [];
    for (let i = 0; i < dossierRecu.items.length; i++) {
      menu.push({
        label: dossierRecu.items[i].label,
        command: () => console.log("test"),
      });
    }

    let bigMenu: MenuItem[] = [];
    bigMenu.push({
      label: dossierRecu.label,
      items: menu
    })

    this.dossier = bigMenu;

  }

}

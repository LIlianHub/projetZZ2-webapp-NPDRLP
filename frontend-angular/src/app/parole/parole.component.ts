import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';
import { ParoleModele } from '../models/parole.model';
import { UserModel } from '../models/user.model';
import { TokenStorageService } from '../services/token-storage.service';


@Component({
  selector: 'app-parole',
  templateUrl: './parole.component.html',
  styleUrls: ['./parole.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ParoleComponent implements OnInit {
  nosParoles!: ParoleModele;
  loading: boolean = true;
  erreur!: string;
  wordEnter: string[] = [];
  difficulte!: number;
  verifTab: boolean[] = [];
  nbMotJuste: number = 0;
  showDossier: boolean = false;
  visibleSidebar: boolean = false;
  currentUser: UserModel | null = null;
  newDifficulte: number = 1;

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute,
    private elRef: ElementRef,
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.difficulte = 1;
    this.currentUser = this.token.getUser();
    this.getParole();
  }

  getParole() {
    this.loading = true;
    this.paroleService
      .getParoleAvecTrou(
        this.route.snapshot.params['artiste'],
        this.route.snapshot.params['musique'],
        this.difficulte
      )
      .subscribe(
        (reponse) => {
          this.nosParoles = reponse;
          this.initialiseTabVerif();
          this.loading = false;
        },
        (erreur) => {
          this.erreur = erreur.error;
          this.loading = false;
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

  showMenuFolder(event: Event) {
    this.showDossier = !this.showDossier;
  }

  changeDifficulte() {

    this.difficulte = this.newDifficulte;
    this.getParole();

  }

}

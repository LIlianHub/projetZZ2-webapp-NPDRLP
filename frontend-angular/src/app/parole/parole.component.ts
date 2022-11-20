import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';
import { ParoleModele } from '../models/parole.model';

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

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute,
    private elRef: ElementRef
  ) {}

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
    console.log(this.wordEnter);
  }

  getAllWords() {
    let value;
    for(let i = 0; i < this.nosParoles.nb_mots_manquant; i++){
      value = this.elRef.nativeElement.querySelector("input[name='form_" + i + "']").value;
      this.wordEnter.push(value.toUpperCase());
    }
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';

@Component({
  selector: 'app-parole',
  templateUrl: './parole.component.html',
  styleUrls: ['./parole.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParoleComponent implements OnInit {
  lesParoles!: string;
  artiste!: string;
  musique!: string;
  loading: boolean = true;

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.artiste = this.route.snapshot.params['artiste'];
    this.musique = this.route.snapshot.params['musique'];
    this.paroleService.getParole(this.artiste, this.musique).subscribe(
      (reponse) => {
        this.lesParoles = reponse['paroles'];
        this.loading = false;
      },
      (erreur) => {
        this.lesParoles = erreur['error'];
        this.loading = false;
      }
    );
  }
}


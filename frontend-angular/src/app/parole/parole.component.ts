import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';

@Component({
  selector: 'app-parole',
  templateUrl: './parole.component.html',
  styleUrls: ['./parole.component.scss'],
})
export class ParoleComponent implements OnInit {
  lesParoles!: string;
  loading: boolean = true;

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const artiste = this.route.snapshot.params['artiste'];
    const musique = this.route.snapshot.params['musique'];
    this.paroleService.getParole(artiste, musique).subscribe(
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

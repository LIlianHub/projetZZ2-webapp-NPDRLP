import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
})

export class AccueilComponent implements OnInit {
  images: String[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 1; i <= 4; i++) {
      this.images.push('assets/img/accueil/' + i + '.png');
    }
  }
}

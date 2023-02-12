import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-musique-form',
  templateUrl: './musique-form.component.html',
  styleUrls: ['./musique-form.component.scss'],
})
export class MusiqueFormComponent implements OnInit {
  FormData!: FormGroup;
  val1 !: number;

  constructor(private builder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.FormData = this.builder.group({
      Artiste: new FormControl('', [Validators.required]),
      Musique: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    let url =
      '/paroles/' +
      this.FormData.value.Artiste +
      '/' +
      this.FormData.value.Musique;
    this.router.navigate([url]);
  }
}

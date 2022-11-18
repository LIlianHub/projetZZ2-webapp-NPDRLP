import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ParoleModele } from '../models/parole.model';

@Component({
  selector: 'app-form-parole',
  templateUrl: './form-parole.component.html',
  styleUrls: ['./form-parole.component.scss'],
})
export class FormParoleComponent implements OnInit{
  FormData!: FormGroup;
  nosParoles!: ParoleModele;

  
  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.FormData = this.builder.group({
      /*Artiste: new FormControl('', [Validators.required]),
      Musique: new FormControl('', [Validators.required]),*/
    });
  }
  onSubmit() {
    
  }

}

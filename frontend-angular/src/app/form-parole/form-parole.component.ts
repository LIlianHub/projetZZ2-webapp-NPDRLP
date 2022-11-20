import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ParoleModele } from '../models/parole.model';
import { formData } from '../models/formData.model';
import { ParoleService } from '../services/parole.service';

@Component({
  selector: 'app-form-parole',
  templateUrl: './form-parole.component.html',
  styleUrls: ['./form-parole.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormParoleComponent implements OnInit {
  ParoleForm!: FormGroup;
  nosParoles!: ParoleModele;
  loading: boolean = true;
  artiste!: string;
  musique!: string;

  constructor(
    private builder: FormBuilder,
    private paroleService: ParoleService
  ) {}

  ngOnInit() {
    this.paroleService.getParoleTest(this.artiste, this.musique).subscribe(
      (reponse) => {
        this.nosParoles = reponse;
        this.buildFormGroup();
        this.loading = false;
      },
      (erreur) => {
        console.log("Erreur");
      }
    );
  }

  buildFormGroup() {
    let form: formData = {};

    for (let i = 0; i < /*this.nosParoles.nb_mots_manquant*/ 2; i++) {
      form['form_' + i] = new FormControl('');
    }

    this.ParoleForm = this.builder.group(form);
    console.log(form);
  }

  onSubmit() {
    console.log(this.ParoleForm.value);
  }
}

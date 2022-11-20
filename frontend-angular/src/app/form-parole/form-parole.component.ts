import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ParoleModele } from '../models/parole.model';
import { formData } from '../models/formData.model';

@Component({
  selector: 'app-form-parole',
  templateUrl: './form-parole.component.html',
  styleUrls: ['./form-parole.component.scss'],
})
export class FormParoleComponent implements OnInit {
  ParoleForm!: FormGroup;
  nosParoles!: ParoleModele;

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.buildFormGroup();
  }

  buildFormGroup() {
    let form: formData = {};
    let clef: string;

    for (let i = 0; i < /*this.nosParoles.nb_mots_manquant*/ 2; i++) {
      clef = 'form_' + i;
      form[clef] = new FormControl('');
    }

    this.ParoleForm = this.builder.group(form);
    console.log(form);
  }

  onSubmit() {
    console.log(this.ParoleForm.value)
  }
}

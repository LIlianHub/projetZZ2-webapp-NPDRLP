import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParoleService } from '../services/parole.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ParoleModele } from '../models/parole.model';
import { formData } from '../models/formData.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-parole',
  templateUrl: './parole.component.html',
  styleUrls: ['./parole.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParoleComponent implements OnInit {
  ParoleForm!: FormGroup;
  nosParoles!: ParoleModele;
  loading: boolean = true;
  erreur!: string;
  parole!: SafeHtml;

  constructor(
    private paroleService: ParoleService,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private sanitizer: DomSanitizer,
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
          this.parole = this.sanitizer.bypassSecurityTrustHtml(this.nosParoles.code_html);
          this.buildFormGroup();
          this.loading = false;
          console.log(this.nosParoles);
        },
        (erreur) => {
          this.erreur = erreur.error;
          this.loading = false;
        }
      );
  }

  buildFormGroup() {
    let form: formData = {};

    for (let i = 0; i < this.nosParoles.nb_mots_manquant; i++) {
      form['form_' + i] = new FormControl('');
    }

    this.ParoleForm = this.builder.group(form);
  }

  onSubmit() {
    console.log(this.ParoleForm.value);
  }
}

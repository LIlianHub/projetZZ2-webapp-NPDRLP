import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  FormData!: FormGroup;
  message = '';
  reussite: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.FormData = this.builder.group({
      Login: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required]),
    });

    //on efface le message d'erreur si l'utilisateur ecrit
    this.FormData.valueChanges.subscribe((x) => {
      this.message = '';
    });
  }

  onSubmit(): void {
    this.FormData.reset();
    if (this.FormData.value.Password === this.FormData.value.ConfirmPassword) {
      this.authService
        .register(this.FormData.value.Login, this.FormData.value.Password)
        .subscribe(
          (data) => {
            this.reussite = true;
            this.message = 'Inscription réussie';
          },
          (err) => {
            console.log(err);
            //mettre message d'erreur dans erroMessage
          }
        );
    } else {
      this.message = 'Les mots de passe ne correspondent pas';
    }
  }
}

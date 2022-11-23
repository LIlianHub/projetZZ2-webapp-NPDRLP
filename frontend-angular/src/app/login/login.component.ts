import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  FormData!: FormGroup;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.goHome();
    }
    //si pas de token on affiche le formulaire de login
    this.FormData = this.builder.group({
      Login: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.authService
      .login(this.FormData.value.Login, this.FormData.value.Password)
      .subscribe(
        (data) => {
          this.tokenStorage.saveToken(data.accessToken);
          //on doit recevoir dans un json un user type dans le champ user !
          this.tokenStorage.saveUser(data.user);
          this.goHome();
        },
        (err) => {
          console.log(err);
          this.FormData.reset();
          //mettre message d'erreur dans erroMessage
        }
      );
  }

  goHome(): void {
    this.router.navigate(['/profile']);
  }
}

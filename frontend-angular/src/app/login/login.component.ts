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
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  FormData!: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private builder: FormBuilder,
    private messageService: MessageService
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
          this.tokenStorage.saveUser(data.userdata);
          this.goHome();
        },
        (err) => {
          this.FormData.reset();
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error,
          });
        }
      );
  }

  goHome(): void {
    this.router.navigate(['/profile']);
  }
}

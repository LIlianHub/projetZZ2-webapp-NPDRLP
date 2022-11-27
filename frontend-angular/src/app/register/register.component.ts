import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  FormData!: FormGroup;
  reussite: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private builder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.FormData = this.builder.group({
      Login: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required]),
    });

    this.FormData.valueChanges.subscribe((data) => {
      this.messageService.clear();
    });
  }

  onSubmit(): void {
    if (this.FormData.value.Password === this.FormData.value.ConfirmPassword) {
      this.authService
        .register(this.FormData.value.Login, this.FormData.value.Password)
        .subscribe(
          (data) => {
            this.reussite = true;
            this.FormData.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Inscription réussie',
            });
            this.messageService.add({
              severity: 'success',
              detail: 'Redirection vers la page de connexion ...',
            });
            setTimeout(() => {
              this.router.navigate(['/connexion']);
            }, 3000);
          },
          (err) => {
            this.FormData.reset();
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: err.error,
            });
          }
        );
    } else {
      this.FormData.reset();
      console.log('Les mots de passe ne correspondent pas');
      this.messageService.add({
        severity: 'error',
        summary: 'Entrez deux mots de passe identiques',
      });
    }
  }
}

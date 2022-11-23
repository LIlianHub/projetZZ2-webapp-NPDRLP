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
  errorMessage = '';

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
  }

  onSubmit(): void {
    if (this.FormData.value.Password === this.FormData.value.ConfirmPassword) {
      this.authService
        .register(this.FormData.value.Login, this.FormData.value.Password)
        .subscribe(
          (data) => {
            this.router.navigate(['/login']);
          },
          (err) => {
            console.log(err);
            this.FormData.reset();
            //mettre message d'erreur dans erroMessage
          }
        );
    } else {
      this.FormData.reset();
      this.errorMessage = 'Les mots de passe ne correspondent pas';
    }
  }
}

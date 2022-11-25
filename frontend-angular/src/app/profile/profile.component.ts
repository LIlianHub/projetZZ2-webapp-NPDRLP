import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser!: UserModel | null;
  mytoken!: string;

  constructor(private token: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    else{
      this.mytoken = this.token.getToken()!;
    }
  }

  logOut(): void {
    this.token.signOut();
    this.router.navigate(['/accueil']);
  }
}

import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: UserModel | null = null;
  constructor(private token: TokenStorageService, private router: Router) {}
  ngOnInit() {
    this.currentUser = this.token.getUser();
  }

  logOut(): void {
    this.token.signOut();
  }
}

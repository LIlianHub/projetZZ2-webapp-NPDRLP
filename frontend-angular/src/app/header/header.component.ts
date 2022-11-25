import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: UserModel | null = null;
  constructor(private token: TokenStorageService) {}
  ngOnInit() {
    this.currentUser = this.token.getUser();
  }
}

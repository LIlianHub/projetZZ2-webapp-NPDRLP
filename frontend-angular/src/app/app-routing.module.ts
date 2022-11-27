import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ParoleComponent } from './parole/parole.component';
import { MentionComponent } from './mention/mention.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { RechercheParoleComponent } from './recherche-parole/recherche-parole.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'mention', component: MentionComponent },
  { path: 'entrainement', component: RechercheParoleComponent },
  { path: 'paroles/:artiste/:musique/:difficulte', component: ParoleComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: AccueilComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

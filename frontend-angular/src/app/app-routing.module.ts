import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ParoleComponent } from './parole/parole.component';
import { MentionComponent } from './mention/mention.component';


const routes: Routes = [
  { path: '', component:  AccueilComponent},
  { path: 'accueil', component: AccueilComponent},
  { path: 'mention', component:  MentionComponent},
  { path: 'paroles/:artiste/:musique', component:  ParoleComponent},
  { path: '**', component: AccueilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ParoleComponent } from './parole/parole.component';


const routes: Routes = [
  { path: '', component:  AccueilComponent},
  { path: 'accueil', component: AccueilComponent},
  { path: 'paroles/:artiste/:musique', component:  ParoleComponent},
  { path: '**', component: AccueilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

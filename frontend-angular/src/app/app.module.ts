import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ParoleComponent } from './parole/parole.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';
import { MusiqueFormComponent } from './musique-form/musique-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MentionComponent } from './mention/mention.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SliderModule } from 'primeng/slider';
import { SafeHtmlPipe } from './pipe/safehtml.pipe';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ContextMenuModule } from 'primeng/contextmenu';

import { authInterceptorProviders } from './helpers/auth.interceptor';
import { RechercheParoleComponent } from './recherche-parole/recherche-parole.component';
import { MusicFolderComponent } from './music-folder/music-folder.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import {MenuModule} from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ParoleComponent,
    AccueilComponent,
    MusiqueFormComponent,
    MentionComponent,
    SafeHtmlPipe,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    RechercheParoleComponent,
    MusicFolderComponent,
    YoutubePlayerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProgressSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MenubarModule,
    AvatarModule,
    AvatarGroupModule,
    SliderModule,
    MessagesModule,
    MessageModule,
    BrowserAnimationsModule,
    ConfirmPopupModule,
    ToastModule,
    PanelMenuModule,
    ContextMenuModule,
    YouTubePlayerModule,
    MenuModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule { }

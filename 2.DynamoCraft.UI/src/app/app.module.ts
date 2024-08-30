import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorieComponent } from './components/categorie/categorie.component';
import { NouveautesComponent } from './components/nouveautes/nouveautes.component';
import { Top10Component } from './components/top-10/top-10.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { AuthModule } from './modules/auth/auth.module';
import { ContactComponent } from './components/contact/contact.component';
import { QuiSommesNousComponent } from './components/qui-sommes-nous/qui-sommes-nous.component';
import { PolitiqueConfidentialiteComponent } from './components/politique-confidentialite/politique-confidentialite.component';
import { ConditionsUtilisationComponent } from './components/conditions-utilisation/conditions-utilisation.component';
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { ProjetModule } from './modules/projet/projet.module';
import { AdminModule } from './modules/admin/admin.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavBarComponent,
        FooterComponent,
        CategorieComponent,
        NouveautesComponent,
        Top10Component,
        RechercheComponent,
        ContactComponent,
        QuiSommesNousComponent,
        PolitiqueConfidentialiteComponent,
        ConditionsUtilisationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        UtilisateurModule,
        ProjetModule,
        AdminModule
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

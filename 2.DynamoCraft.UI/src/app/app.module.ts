import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
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
import { NgChartsModule } from 'ng2-charts';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { AccesNonAutoriserComponent } from './components/acces-non-autoriser/acces-non-autoriser.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { JwtInterceptor } from './tools/interceptors/jwt';
import { ProjetRoutingModule } from './modules/projet/projet-routing.module';

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
        ConditionsUtilisationComponent,
        AccesNonAutoriserComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        UtilisateurModule,
        ProjetModule,
        AdminModule,
        ProjetRoutingModule ,
        NgChartsModule,
        RecaptchaModule,
        RecaptchaFormsModule
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
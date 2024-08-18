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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavBarComponent,
        FooterComponent,
        CategorieComponent,
        NouveautesComponent,
        Top10Component,
        RechercheComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

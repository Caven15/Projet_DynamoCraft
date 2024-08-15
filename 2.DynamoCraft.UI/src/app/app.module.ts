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
<<<<<<< HEAD
import { NouveautesComponent } from './components/nouveautes/nouveautes.component';
=======
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavBarComponent,
        FooterComponent,
<<<<<<< HEAD
        CategorieComponent,
        NouveautesComponent
=======
        CategorieComponent
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch(), withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

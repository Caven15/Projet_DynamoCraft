import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import path from 'path';
import { CategorieComponent } from './components/categorie/categorie.component';
import { NouveautesComponent } from './components/nouveautes/nouveautes.component';
import { Top10Component } from './components/top-10/top-10.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { ContactComponent } from './components/contact/contact.component';
import { QuiSommesNousComponent } from './components/qui-sommes-nous/qui-sommes-nous.component';
import { PolitiqueConfidentialiteComponent } from './components/politique-confidentialite/politique-confidentialite.component';
import { ConditionsUtilisationComponent } from './components/conditions-utilisation/conditions-utilisation.component';

const routes: Routes = [
    {path: 'auth', loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule)},
    {path: 'utilisateur', loadChildren: () => import('./modules/utilisateur/utilisateur-routing.module').then(m => m.UtilisateurRoutingModule)},
    {path: 'projet', loadChildren: () => import('./modules/projet/projet-routing.module').then(m => m.ProjetRoutingModule)},
    {path: 'admin', loadChildren: () => import('./modules/admin/admin-routing.module').then(m => m.AdminRoutingModule)},
    { path: 'home', component: HomeComponent },
    { path: 'modele', children : [
        {path: 'categories', component : CategorieComponent},
        {path: 'nouveautes', component : NouveautesComponent},
        { path: 'top10', component: Top10Component },
    ] },
    { path: 'recherche', component: RechercheComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'quiSommesnous', component: QuiSommesNousComponent },
    { path: 'politiqueConfidentialite', component: PolitiqueConfidentialiteComponent },
    { path: 'conditionsUtilisation', component: ConditionsUtilisationComponent },

    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import path from 'path';
import { CategorieComponent } from './components/categorie/categorie.component';
import { NouveautesComponent } from './components/nouveautes/nouveautes.component';
import { Top10Component } from './components/top-10/top-10.component';
import { RechercheComponent } from './components/recherche/recherche.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'modele', children : [
        {path: 'categories', component : CategorieComponent},
        {path: 'nouveautes', component : NouveautesComponent}
    ] },
    { path: 'top10', component: Top10Component },
    { path: 'recherche', component: RechercheComponent },

    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './components/profil/profil.component';
import { RealisationsComponent } from './components/realisations/realisations.component';
import { ProfilPriveComponent } from './components/profil-prive/profil-prive.component';
import { StatistiquesComponent } from './components/profil-prive/statistiques/statistiques.component';
import { DetailsComponent } from './components/profil-prive/details/details.component';
import { BibliothequesComponent } from './components/profil-prive/bibliotheques/bibliotheques.component';

const routes: Routes = [
    { path: 'profil', component: ProfilComponent },
    { path: 'profil/:id', component: ProfilComponent },
    { path: 'profil-user', component: ProfilPriveComponent },
    { path: 'realisations/:id', component: RealisationsComponent },
    { path: 'informations', component: DetailsComponent },
    { path: 'statistiques', component: StatistiquesComponent },
    { path: 'bibliotheques', component: BibliothequesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilisateurRoutingModule { }

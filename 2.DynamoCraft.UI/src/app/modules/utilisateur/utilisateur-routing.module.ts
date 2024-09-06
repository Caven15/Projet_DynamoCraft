import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './components/profil/profil.component';
import { RealisationsComponent } from './components/realisations/realisations.component';
import { ProfilPriveComponent } from './components/profil-prive/profil-prive.component';
import { StatistiquesComponent } from './components/profil-prive/statistiques/statistiques.component';
import { DetailsComponent } from './components/profil-prive/details/details.component';
import { BibliothequesComponent } from './components/profil-prive/bibliotheques/bibliotheques.component';
import { roleGuard } from '../../tools/guards/auth/role.guard';

const routes: Routes = [
    { path: 'profil', component: ProfilComponent },
    { path: 'profil/:id', component: ProfilComponent },
    { path: 'profil-user', component: ProfilPriveComponent, canActivate: [roleGuard], data: { role: '1' } },
    { path: 'realisations/:id', component: RealisationsComponent },
    { path: 'informations', component: DetailsComponent, canActivate: [roleGuard], data: { role: '1' } },
    { path: 'statistiques', component: StatistiquesComponent, canActivate: [roleGuard], data: { role: '1' } },
    { path: 'bibliotheques', component: BibliothequesComponent, canActivate: [roleGuard], data: { role: '1' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilisateurRoutingModule { }

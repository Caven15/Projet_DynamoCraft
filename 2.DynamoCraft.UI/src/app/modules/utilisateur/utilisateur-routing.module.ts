import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilComponent } from './components/profil/profil.component';
import { RealisationsComponent } from './components/realisations/realisations.component';

const routes: Routes = [
    { path: 'profil', component: ProfilComponent },
    { path: 'profil/:id', component: ProfilComponent },
    { path: 'realisations/:id', component: RealisationsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilisateurRoutingModule { }

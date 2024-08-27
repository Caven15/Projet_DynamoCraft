import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { ProfilComponent } from './components/profil/profil.component';
import { RealisationsComponent } from './components/realisations/realisations.component';
import { ProfilPriveComponent } from './components/profil-prive/profil-prive.component';
import { DetailsComponent } from './components/profil-prive/details/details.component';
import { StatistiquesComponent } from './components/profil-prive/statistiques/statistiques.component';
import { BibliothequesComponent } from './components/profil-prive/bibliotheques/bibliotheques.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfilComponent,
    RealisationsComponent,
    ProfilPriveComponent,
    DetailsComponent,
    StatistiquesComponent,
    BibliothequesComponent
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UtilisateurModule { }

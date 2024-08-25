import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { ProfilComponent } from './components/profil/profil.component';
import { RealisationsComponent } from './components/realisations/realisations.component';


@NgModule({
  declarations: [
    ProfilComponent,
    RealisationsComponent
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule
  ]
})
export class UtilisateurModule { }

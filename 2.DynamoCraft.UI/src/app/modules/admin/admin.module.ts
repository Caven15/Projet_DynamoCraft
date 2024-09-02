import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DetailValidationComponent } from './components/detail-validation/detail-validation.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { ProjetsComponent } from './components/panel-admin/projets/projets.component';
import { StatsComponent } from './components/panel-admin/stats/stats.component';
import { UsersComponent } from './components/panel-admin/users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjetParStatutComponent } from './components/panel-admin/stats/projet-par-statut/projet-par-statut.component';
import { ProjetParCategorieComponent } from './components/panel-admin/stats/projet-par-categorie/projet-par-categorie.component';
import { ProjetTop5Component } from './components/panel-admin/stats/projet-top5/projet-top5.component';
import { ProjetEvolutionComponent } from './components/panel-admin/stats/projet-evolution/projet-evolution.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DetailValidationComponent,
    PanelAdminComponent,
    ProjetsComponent,
    StatsComponent,
    UsersComponent,
    ProjetParStatutComponent,
    ProjetParCategorieComponent,
    ProjetTop5Component,
    ProjetEvolutionComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { }

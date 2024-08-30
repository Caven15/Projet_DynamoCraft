import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DetailValidationComponent } from './components/detail-validation/detail-validation.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { ProjetsComponent } from './components/panel-admin/projets/projets.component';
import { StatsComponent } from './components/panel-admin/stats/stats.component';
import { UsersComponent } from './components/panel-admin/users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DetailValidationComponent,
    PanelAdminComponent,
    ProjetsComponent,
    StatsComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }

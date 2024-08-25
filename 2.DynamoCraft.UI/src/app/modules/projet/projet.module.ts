import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjetRoutingModule } from './projet-routing.module';
import { AjoutComponent } from './components/ajout/ajout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './components/update/update.component';
import { DetailComponent } from './components/detail/detail.component';


@NgModule({
  declarations: [
    AjoutComponent,
    UpdateComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    ProjetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProjetModule { }

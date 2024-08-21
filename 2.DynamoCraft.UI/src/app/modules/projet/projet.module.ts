import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjetRoutingModule } from './projet-routing.module';
import { AjoutComponent } from './components/ajout/ajout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AjoutComponent
  ],
  imports: [
    CommonModule,
    ProjetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProjetModule { }

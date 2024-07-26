import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import path from 'path';
import { CategorieComponent } from './components/categorie/categorie.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'modele', children : [
        {path: 'categories', component : CategorieComponent}
    ] },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

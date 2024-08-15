import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import path from 'path';
import { CategorieComponent } from './components/categorie/categorie.component';
<<<<<<< HEAD
import { NouveautesComponent } from './components/nouveautes/nouveautes.component';
=======
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'modele', children : [
<<<<<<< HEAD
        {path: 'categories', component : CategorieComponent},
        {path: 'nouveautes', component : NouveautesComponent}
=======
        {path: 'categories', component : CategorieComponent}
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb
    ] },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

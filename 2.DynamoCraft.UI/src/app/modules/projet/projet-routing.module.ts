import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjoutComponent } from './components/ajout/ajout.component';
import { UpdateComponent } from './components/update/update.component';

const routes: Routes = [
    { path: 'ajout', component: AjoutComponent },
    { path: 'update/:id', component: UpdateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjetRoutingModule { }

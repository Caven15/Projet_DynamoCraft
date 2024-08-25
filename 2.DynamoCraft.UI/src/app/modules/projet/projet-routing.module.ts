import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjoutComponent } from './components/ajout/ajout.component';
import { UpdateComponent } from './components/update/update.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
    { path: 'ajout', component: AjoutComponent },
    { path: 'update/:id', component: UpdateComponent },
    { path: 'detail/:id', component: DetailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjetRoutingModule { }

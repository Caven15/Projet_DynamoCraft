import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailValidationComponent } from './components/detail-validation/detail-validation.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';

const routes: Routes = [
    { path: 'panel', component: PanelAdminComponent },
    { path: 'detail-validation/:id', component: DetailValidationComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

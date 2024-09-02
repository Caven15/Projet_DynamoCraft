import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailValidationComponent } from './components/detail-validation/detail-validation.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { roleGuard } from '../../tools/guards/auth/role.guard';

const routes: Routes = [
    { path: 'panel', component: PanelAdminComponent, canActivate: [roleGuard], data: { role: '3' }  },
    { path: 'detail-validation/:id', component: DetailValidationComponent, canActivate: [roleGuard], data: { role: '1' }  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailValidationComponent } from './components/detail-validation/detail-validation.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { roleGuard } from '../../tools/guards/auth/role.guard';
import { StatsComponent } from './components/panel-admin/stats/stats.component';
import { ProjetsComponent } from './components/panel-admin/projets/projets.component';
import { UsersComponent } from './components/panel-admin/users/users.component';

const routes: Routes = [
    { path: 'panel', component: PanelAdminComponent, canActivate: [roleGuard], data: { role: '2' }  },
    { path: 'statistiques', component: StatsComponent, canActivate: [roleGuard], data: { role: '2' }  },
    { path: 'projets', component: ProjetsComponent, canActivate: [roleGuard], data: { role: '2' }  },
    { path: 'utilisateurs', component: UsersComponent, canActivate: [roleGuard], data: { role: '2' }  },
    { path: 'detail-validation/:id', component: DetailValidationComponent, canActivate: [roleGuard], data: { role: '2' }  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

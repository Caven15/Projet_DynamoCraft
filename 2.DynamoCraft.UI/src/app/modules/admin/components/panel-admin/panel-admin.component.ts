import { Component } from '@angular/core';

@Component({
    selector: 'app-panel-admin',
    templateUrl: './panel-admin.component.html',
    styleUrl: './panel-admin.component.scss'
})
export class PanelAdminComponent {
    activeTab: string = 'users';  // Onglet par défaut

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }
}

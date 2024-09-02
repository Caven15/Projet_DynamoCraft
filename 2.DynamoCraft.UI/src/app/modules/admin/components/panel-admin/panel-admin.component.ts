import { Component } from '@angular/core';

@Component({
    selector: 'app-panel-admin',
    templateUrl: './panel-admin.component.html',
    styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent {
    isTabLoading: boolean = true;
    activeTab: string = 'users';

    setActiveTab(tab: string) {
        this.activeTab = tab;
        this.loadTabData();
    }

    loadTabData() {
        this.isTabLoading = true;
    }

    ngOnInit() {
        this.loadTabData(); // Charger les données au démarrage
    }
}

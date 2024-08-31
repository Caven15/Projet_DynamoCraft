import { Component } from '@angular/core';

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
    activeTab: string = 'statut';  // Onglet par défaut

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }
}

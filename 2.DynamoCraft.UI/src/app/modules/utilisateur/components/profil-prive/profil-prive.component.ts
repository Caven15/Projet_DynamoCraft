import { Component } from '@angular/core';

@Component({
    selector: 'app-profil-prive',
    templateUrl: './profil-prive.component.html',
    styleUrl: './profil-prive.component.scss'
})
export class ProfilPriveComponent {
    activeTab: string = 'details';  // Onglet par défaut

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }
}

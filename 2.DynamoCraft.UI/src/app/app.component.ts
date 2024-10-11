import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { SessionService } from './tools/services/other/session.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'DynamoCraft';
    isLoading = false;

    constructor(
        private sessionService: SessionService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        console.log('AppComponent initialisé');  // Log indiquant que le composant a été chargé

        // Vérifie si le code s'exécute dans un navigateur
        if (isPlatformBrowser(this.platformId)) {
            console.log('Environnement de navigateur détecté, vérification du token dans localStorage');

            // Charger l'utilisateur à partir du token dans le localStorage
            this.sessionService.loadUserFromToken();  // Appel direct sans subscribe car c'est un void

            console.log('Demande de chargement utilisateur exécutée');
        } else {
            console.log('Environnement non-navigateur détecté, chargement utilisateur ignoré');  // Log si on n'est pas dans un navigateur
        }

        // Gérer l'état de chargement lors des événements de navigation
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                console.log('Navigation commencée vers', event.url);  // Log lors du démarrage d'une navigation
                this.isLoading = true;  // Active l'indicateur de chargement
            } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                console.log('Navigation terminée ou annulée', event);  // Log à la fin d'une navigation ou si elle est annulée
                this.isLoading = false;  // Désactive l'indicateur de chargement
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../tools/services/api/projet.service';
import { Projet } from '../../models/projet.model';
import { environment } from '../../../environments/environment.dev';

@Component({
    selector: 'app-top-10',
    templateUrl: './top-10.component.html',
    styleUrls: ['./top-10.component.scss']
})
export class Top10Component implements OnInit {
    top10LikedProjects: Projet[] = [];
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(private projetService: ProjetService) { }

    ngOnInit(): void {
        this.projetService.getTop10Liked().subscribe({
            next: (data) => {
                this.top10LikedProjects = data.map(projet => {
                    if (!Array.isArray(projet.imageProjet)) {
                        projet.imageProjet = projet.imageProjet ? [projet.imageProjet] : [];
                    }
                    return projet;
                });
                // Debugging: Vérification des données en console
                console.log("Données récupérées pour les projets les plus likés :", this.top10LikedProjects);
            },
            error: (error) => {
                console.log('Erreur lors de la récupération des 10 projets les plus likés', error);
            }
        });
    }

    getRankColor(index: number): string {
        switch (index) {
            case 0: return '#FFD700'; // Or pour le premier
            case 1: return '#C0C0C0'; // Argent pour le deuxième
            case 2: return '#CD7F32'; // Bronze pour le troisième
            default: return '#6c757d'; // Gris pour les autres
        }
    }
}

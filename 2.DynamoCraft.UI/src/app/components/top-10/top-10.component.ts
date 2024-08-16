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
                    // Pas besoin de transformer `ImageUtilisateur` en tableau, car il est déjà un objet
                    if (!Array.isArray(projet.ImageProjet)) {
                        projet.ImageProjet = projet.ImageProjet ? [projet.ImageProjet] : [];
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
}

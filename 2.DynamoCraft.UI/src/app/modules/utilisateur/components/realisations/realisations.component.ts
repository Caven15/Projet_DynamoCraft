import { Component } from '@angular/core';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { Projet } from '../../../../models/projet.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment.dev';

@Component({
    selector: 'app-realisations',
    templateUrl: './realisations.component.html',
    styleUrl: './realisations.component.scss'
})
export class RealisationsComponent {
    realisations: Projet[] = [];
    paginatedRealisations: Projet[] = []; // Réalisations à afficher pour la page actuelle
    userId: number;
    url: string = `${environment.apiUrl}/uploads/`;

    // Variables de pagination
    page: number = 1;
    limit: number = 16; // Nombre de réalisations à afficher par page
    totalPages: number = 1;

    constructor(
        private projetService: ProjetService,
        private route: ActivatedRoute
    ) {
        this.userId = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.loadUserRealisations();
    }

    // Charger toutes les réalisations de l'utilisateur
    loadUserRealisations(): void {
        this.projetService.getProjectsByUserId(this.userId).subscribe({
            next: (realisations) => {
                console.log(realisations);
                this.realisations = realisations;
                this.totalPages = Math.ceil(this.realisations.length / this.limit);
                this.updatePaginatedRealisations();
                console.log(`Réalisations de l'utilisateur Id=${this.userId} récupérées avec succès`, realisations);
            },
            error: (error) => {
                console.error(`Erreur lors de la récupération des réalisations pour l'utilisateur Id=${this.userId}`, error);
            }
        });
    }

    // Mettre à jour les réalisations paginées à afficher
    updatePaginatedRealisations(): void {
        const startIndex = (this.page - 1) * this.limit;
        const endIndex = startIndex + this.limit;
        this.paginatedRealisations = this.realisations.slice(startIndex, endIndex);
    }

    // Aller à la page précédente
    prevPage(): void {
        if (this.page > 1) {
            this.page--;
            this.updatePaginatedRealisations();
        }
    }

    // Aller à la page suivante
    nextPage(): void {
        if (this.page < this.totalPages) {
            this.page++;
            this.updatePaginatedRealisations();
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { Projet } from '../../../../models/projet.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service'; // Service d'authentification
import { environment } from '../../../../../environments/environment.dev';
import { UtilisateurService } from '../../../../tools/services/api/utilisateur.service';

@Component({
    selector: 'app-realisations',
    templateUrl: './realisations.component.html',
    styleUrls: ['./realisations.component.scss']
})
export class RealisationsComponent implements OnInit {
    realisations: Projet[] = [];
    paginatedRealisations: Projet[] = []; // Réalisations à afficher pour la page actuelle
    userId: number;
    userPseudo: string | undefined= ''; // Pseudo de l'utilisateur
    isOwner: boolean = false; // Est-ce que l'utilisateur connecté consulte ses propres réalisations ?
    url: string = `${environment.apiUrl}/uploads/`;

    // Variables de pagination
    page: number = 1;
    limit: number = 16; // Nombre de réalisations à afficher par page
    totalPages: number = 1;

    constructor(
        private projetService: ProjetService,
        private UtilisateurService: UtilisateurService,
        private authService: AuthService, // Pour savoir si l'utilisateur est le propriétaire
        private route: ActivatedRoute
    ) {
        this.userId = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.checkIfOwner();
        this.loadUserRealisations();
    }

    // Vérifier si l'utilisateur connecté consulte ses propres réalisations
    checkIfOwner(): void {
        this.authService.currentUser$.subscribe((currentUser) => {
            if (currentUser && currentUser.id === this.userId) {
                this.isOwner = true;
                this.userPseudo = currentUser.pseudo; // Affiche "Vos réalisations"
            } else {
                this.isOwner = false;
                this.loadUserPseudo();
            }
        });
    }

    // Charger le pseudo de l'utilisateur consulté si ce n'est pas le propriétaire
    loadUserPseudo(): void {
        this.UtilisateurService.getUtilisateurById(this.userId).subscribe({
            next: (user) => {
                this.userPseudo = user.pseudo;
            },
            error: (error) => {
                console.error(`Erreur lors de la récupération de l'utilisateur Id=${this.userId}`, error);
            }
        });
    }

    // Charger toutes les réalisations de l'utilisateur
    loadUserRealisations(): void {
        this.projetService.getProjectsByUserId(this.userId).subscribe({
            next: (realisations) => {
                this.realisations = realisations;
                this.totalPages = Math.ceil(this.realisations.length / this.limit);
                this.updatePaginatedRealisations();
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

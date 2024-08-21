import { Component } from '@angular/core';
import { Projet } from '../../models/projet.model';
import { environment } from '../../../environments/environment.dev';
import { ProjetService } from '../../tools/services/api/projet.service';

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrl: './recherche.component.scss'
})
export class RechercheComponent {
    projects: Projet[] = [];
    searchQuery: string = 'projet';  // Définir la valeur par défaut
    page: number = 1;
    totalPages: number = 1;
    limit: number = 12;  // Nombre de résultats par page
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(private projetService: ProjetService) { }

    ngOnInit(): void {
        this.onSearch();  // Initialiser la recherche avec le mot "projets"
    }

    onSearch(): void {
        if (this.searchQuery.trim() !== '') {
            this.projetService.searchProjects(this.searchQuery, this.page, this.limit).subscribe({
                next: (response) => {
                    this.projects = response.projects;  // Récupérer les projets
                    this.totalPages = response.totalPages;  // Nombre total de pages
                    console.log("Projets trouvés :", this.projects);
                    console.log(this.projects[0].imageProjet);
                },
                error: (error) => {
                    console.log('Erreur lors de la recherche des projets', error);
                }
            });
        }
    }

    // Pagination - Page précédente
    prevPage(): void {
        if (this.page > 1) {
            this.page--;
            this.onSearch();
        }
    }

    // Pagination - Page suivante
    nextPage(): void {
        if (this.page < this.totalPages) {
            this.page++;
            this.onSearch();
        }
    }
}

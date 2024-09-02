import { Component } from '@angular/core';
import { Projet } from '../../models/projet.model';
import { environment } from '../../../environments/environment.dev';
import { ProjetService } from '../../tools/services/api/projet.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrls: ['./recherche.component.scss']
})
export class RechercheComponent {
    projects: Projet[] = [];
    searchQuery: string = '';  // Définir la valeur par défaut comme vide pour initialiser avec tous les projets
    page: number = 1;
    totalPages: number = 1;
    limit: number = 16;  // Nombre de résultats par page
    totalItems: number = 0;  // Nombre total de projets
    url: string = `${environment.apiUrl}/uploads/`;
    private searchSubject = new Subject<string>();

    constructor(private projetService: ProjetService) { }

    ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(300),  // Attendre 300ms après le dernier changement de mot-clé
            distinctUntilChanged()  // Ne pas émettre si le mot-clé est identique au précédent
        ).subscribe(query => {
            this.page = 1;  // Réinitialiser à la première page lors d'une nouvelle recherche
            this.onSearch();
        });

        this.onSearch();  // Initialiser la recherche avec tous les projets
    }

    onSearch(): void {
        this.projetService.searchProjects(this.searchQuery, this.page, this.limit).subscribe({
            next: (response) => {
                console.log(response);
                this.projects = response.projects;  // Récupérer les projets
                this.totalPages = response.totalPages;  // Nombre total de pages
                this.totalItems = response.totalItems;  // Nombre total d'éléments

                // Ajustez la page courante si elle est supérieure au nombre total de pages disponibles
                if (this.page > this.totalPages) {
                    this.page = this.totalPages;
                }
            },
            error: (error) => {
                console.log('Erreur lors de la recherche des projets', error);
            }
        });
    }


    // Méthode appelée lorsque l'utilisateur tape dans la barre de recherche
    onSearchQueryChange(query: string): void {
        this.searchSubject.next(query);
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

    // Désactivation des boutons de pagination
    canGoToNextPage(): boolean {
        return this.page < this.totalPages;
    }

    canGoToPrevPage(): boolean {
        return this.page > 1;
    }
}

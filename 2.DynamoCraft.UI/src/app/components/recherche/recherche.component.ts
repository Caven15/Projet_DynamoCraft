import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Projet } from '../../models/projet.model';
import { environment } from '../../../environments/environment.dev';
import { ProjetService } from '../../tools/services/api/projet.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CategorieService } from '../../tools/services/api/categorie.service';
import { Categorie } from '../../models/categorie.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrls: ['./recherche.component.scss']
})
export class RechercheComponent implements OnInit {
    projects: Projet[] = [];
    searchQuery: string = '';
    selectedOption: string | null = 'all';
    selectedText: string = 'Tous les projets';
    page: number = 1;
    totalPages: number = 1;
    limit: number = 16;
    totalItems: number = 0;
    categories: Categorie[] = [];
    url: string = `${environment.apiUrl}/uploads/`;
    private searchSubject = new Subject<string>();

    private searchResults: Projet[] = [];

    constructor(private projetService: ProjetService, private categorieService: CategorieService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const categorie = params['categorie'];
            if (categorie) {
                this.onOptionChange(categorie);
            }
        });

        this.categorieService.getAllCategorie().subscribe({
            next: (data) => {
                this.categories = data;
                console.log("Catégories récupérées avec succès :", this.categories);
            },
            error: (error) => {
                console.error("Erreur lors de la récupération des catégories :", error);
            },
            complete: () => {
                console.log("Récupération des catégories terminée.");
            }
        });

        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchQuery = query;
            this.page = 1;
            this.onSearch();
        });

        this.onSearch();
    }

    onSearch(): void {
        if (this.selectedOption === 'all') {
            this.projetService.searchProjects(this.searchQuery, this.page, this.limit).subscribe({
                next: (searchResponse) => {
                    this.searchResults = this.page === 1 ? searchResponse.projects : this.searchResults.concat(searchResponse.projects);
                    this.totalItems = searchResponse.totalItems;
                    this.totalPages = Math.ceil(this.totalItems / this.limit);
                    this.updatePagination();
                },
                error: (error) => {
                    console.error('Erreur lors de la recherche des projets', error);
                }
            });
        } else if (this.selectedOption) {
            this.projetService.getProjectsByCategoryName(this.selectedOption).subscribe({
                next: (projects) => {
                    this.searchResults = this.page === 1 ? projects : this.searchResults.concat(projects);
                    this.totalItems = projects.length;
                    this.totalPages = Math.ceil(this.totalItems / this.limit);
                    this.updatePagination();
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération des projets par catégorie', error);
                }
            });
        }
    }

    updatePagination(): void {
        const startIndex = (this.page - 1) * this.limit;
        const endIndex = this.page * this.limit;
        this.projects = this.searchResults.slice(startIndex, endIndex);
        this.cdr.detectChanges();
    }

    trackByProjet(index: number, projet: Projet): number {
        return projet.id;
    }

    onSearchQueryChange(query: string): void {
        this.searchSubject.next(query);
    }

    onOptionChange(categorie: string): void {
        this.selectedOption = categorie;
        this.selectedText = this.getDisplayText(categorie);
        this.page = 1;
        this.onSearch();
    }

    getDisplayText(categorie: string): string {
        return categorie === 'all' ? 'Tous les projets' : categorie;
    }

    prevPage(): void {
        if (this.page > 1) {
            this.page--;
            this.onSearch();
        }
    }

    nextPage(): void {
        if (this.page < this.totalPages) {
            this.page++;
            this.onSearch();
        }
    }

    canGoToNextPage(): boolean {
        return this.page < this.totalPages;
    }

    canGoToPrevPage(): boolean {
        return this.page > 1;
    }
}

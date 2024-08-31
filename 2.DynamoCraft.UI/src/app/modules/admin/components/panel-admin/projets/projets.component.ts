import { Component, OnInit } from '@angular/core';
import { Projet } from '../../../../../models/projet.model';
import { ProjetService } from '../../../../../tools/services/api/projet.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projets',
    templateUrl: './projets.component.html',
    styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {
    projets: Projet[] = [];
    filteredProjets: Projet[] = [];
    selectedFilter: string = 'all';
    selectedFilterText: string = 'Tous les projets';
    searchTerm: string = ''; // Barre de recherche

    // Variables pour le tri
    sortColumn: string = 'nom';
    sortDirection: 'asc' | 'desc' = 'asc';

    // Variables pour la pagination
    itemsPerPage: number = 10;  // Nombre d'éléments par page
    currentPage: number = 1;    // Page courante
    maxPageButtons: number = 5; // Nombre maximum de boutons de pages à afficher

    constructor(
        private projetService: ProjetService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadProjets();
    }

    setFilter(filter: string): void {
        this.selectedFilter = filter;
        this.selectedFilterText = this.getFilterText(filter);
        this.loadProjets();
    }

    getFilterText(filter: string): string {
        switch (filter) {
            case 'valide': return 'Projets Valides';
            case 'invalide': return 'Projets Invalides';
            case 'attente': return 'Projets en Attente de Validation';
            default: return 'Tous les projets';
        }
    }

    loadProjets(): void {
        console.log(`Chargement des projets pour le filtre : ${this.selectedFilter}`);

        let projectObservable;

        if (this.selectedFilter === 'valide') {
            projectObservable = this.projetService.getValidProjet();
        } else if (this.selectedFilter === 'invalide') {
            projectObservable = this.projetService.getInvalidProjet();
        } else if (this.selectedFilter === 'attente') {
            projectObservable = this.projetService.getPendingProjet();
        } else {
            projectObservable = this.projetService.getAllProjets();
        }

        projectObservable.subscribe({
            next: (projets) => {
                console.log(`Projets récupérés :`, projets);
                this.projets = projets.filter(projet => projet.nom);
                this.filterProjets();
            },
            error: (error) => {
                console.error('Erreur lors de la récupération des projets :', error);
            }
        });
    }

    filterProjets(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        const filtered = this.projets.filter(projet =>
            projet.nom && projet.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        this.filteredProjets = filtered.slice(startIndex, endIndex);
        this.sortData(this.sortColumn); // Appliquer le tri après le filtrage
    }

    sortData(column: string): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredProjets.sort((a, b) => {
            let valueA = this.getNestedValue(a, column);
            let valueB = this.getNestedValue(b, column);

            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    getSortIcon(column: string): string {
        if (this.sortColumn === column) {
            return this.sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
        }
        return 'bi-sort';
    }

    changePage(page: number): void {
        if (page > 0 && page <= this.getTotalPages()) {
            this.currentPage = page;
            this.filterProjets();
        }
    }

    getTotalPages(): number {
        return Math.ceil(this.projets.length / this.itemsPerPage);
    }

    getPaginationPages(): number[] {
        const totalPages = this.getTotalPages();
        const halfMax = Math.floor(this.maxPageButtons / 2);
        let startPage = Math.max(1, this.currentPage - halfMax);
        let endPage = Math.min(totalPages, startPage + this.maxPageButtons - 1);

        if (endPage - startPage < this.maxPageButtons - 1) {
            startPage = Math.max(1, endPage - this.maxPageButtons + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }

    viewProjectDetails(projetId: number): void {
        this.router.navigate([`/projet/detail/${projetId}`]);
    }

    validateProject(projetId: number): void {
        this.router.navigate([`/admin/detail-validation/${projetId}`]);
    }

    invalidateProject(projetId: number): void {
        console.log(`Invalidation du projet avec ID : ${projetId}`);
        this.loadProjets();
    }
}

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

        if (this.selectedFilter === 'valide') {
            this.projetService.getValidProjet().subscribe({
                next: (projets) => {
                    console.log('Projets valides récupérés :', projets);
                    this.projets = projets.filter(projet => projet.nom);
                    this.filterProjets();
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération des projets valides :', error);
                }
            });
        } else if (this.selectedFilter === 'invalide') {
            this.projetService.getInvalidProjet().subscribe({
                next: (projets) => {
                    console.log('Projets invalides récupérés :', projets);
                    this.projets = projets.filter(projet => projet.nom);
                    this.filterProjets();
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération des projets invalides :', error);
                }
            });
        } else if (this.selectedFilter === 'attente') {
            this.projetService.getPendingProjet().subscribe({
                next: (projets) => {
                    console.log('Projets en attente récupérés :', projets);
                    this.projets = projets.filter(projet => projet.nom);
                    this.filterProjets();
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération des projets en attente :', error);
                }
            });
        } else {
            this.projetService.getAllProjets().subscribe({
                next: (projets) => {
                    console.log('Tous les projets récupérés :', projets);
                    this.projets = projets.filter(projet => projet.nom);
                    this.filterProjets();
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération de tous les projets :', error);
                }
            });
        }
    }

    filterProjets(): void {
        this.filteredProjets = this.projets.filter(projet =>
            projet.nom && projet.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.sortData(this.sortColumn); // Appliquer le tri après le filtrage
        console.log('Projets filtrés :', this.filteredProjets);
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

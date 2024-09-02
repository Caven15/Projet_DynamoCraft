import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from '../../../../../models/utilisateur.model';
import { UtilisateurService } from '../../../../../tools/services/api/utilisateur.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    utilisateurs: Utilisateur[] = [];
    filteredUtilisateurs: Utilisateur[] = [];
    searchTerm: string = '';

    // Variables pour le tri
    sortColumn: string = 'pseudo';
    sortDirection: 'asc' | 'desc' = 'asc';

    // Variables pour la pagination
    itemsPerPage: number = 10;  // Nombre d'éléments par page
    currentPage: number = 1;    // Page courante
    maxPageButtons: number = 5; // Nombre maximum de boutons de pages à afficher

    constructor(
        private utilisateurService: UtilisateurService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadUtilisateurs();
    }

    loadUtilisateurs(): void {
        this.utilisateurService.getAllUtilisateurs().subscribe(users => {
            console.log(users);
            this.utilisateurs = users;
            this.filterUtilisateurs();
        });
    }

    filterUtilisateurs(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        const filtered = this.utilisateurs.filter(utilisateur =>
            utilisateur.pseudo!.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        this.filteredUtilisateurs = filtered.slice(startIndex, endIndex);
        this.sortData(this.sortColumn); // Appliquer le tri après le filtrage
    }

    sortData(column: string): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredUtilisateurs.sort((a, b) => {
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
            this.filterUtilisateurs();
        }
    }

    getTotalPages(): number {
        return Math.ceil(this.utilisateurs.length / this.itemsPerPage);
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

    viewUserDetails(id: number | undefined): void {
        if (id !== undefined) {
            this.router.navigate([`utilisateur/profil/${id}`]);
        }
    }

    deleteUser(id: number | undefined): void {
        if (id !== undefined && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.utilisateurService.deleteUtilisateur(id).subscribe(() => {
                this.loadUtilisateurs(); // Recharger la liste après suppression
            });
        }
    }

    toggleUserActivation(id: number | undefined): void {
        if (id !== undefined) {
            this.utilisateurService.toggleActivation(id).subscribe(() => {
                this.loadUtilisateurs(); // Recharger la liste pour refléter le changement de statut
            });
        }
    }
}
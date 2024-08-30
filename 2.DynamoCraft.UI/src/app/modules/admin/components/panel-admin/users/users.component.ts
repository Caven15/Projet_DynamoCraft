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
        this.filteredUtilisateurs = this.utilisateurs.filter(utilisateur =>
            utilisateur.pseudo!.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
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

    viewUserDetails(id: number | undefined): void {
        if (id !== undefined) {
            this.router.navigate([`/profil/${id}`]);
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

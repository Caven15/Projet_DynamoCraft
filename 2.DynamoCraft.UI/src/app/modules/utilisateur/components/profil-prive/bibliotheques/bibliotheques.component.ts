import { Component, OnInit } from '@angular/core';
import { Projet } from '../../../../../models/projet.model';
import { ProjetService } from '../../../../../tools/services/api/projet.service';
import { AuthService } from '../../../../../tools/services/api/auth.service';
import { Router } from '@angular/router';
import { UtilisateurProjetService } from '../../../../../tools/services/api/utilisateur-projet.service';

@Component({
    selector: 'app-user-bibliotheques',
    templateUrl: './bibliotheques.component.html',
    styleUrls: ['./bibliotheques.component.scss']
})
export class BibliothequesComponent implements OnInit {
    downloadedModels: Projet[] = [];
    addedModels: Projet[] = [];

    // Initialisation pour tri par nom
    downloadedSortColumn: string = 'nom';
    downloadedSortDirection: 'asc' | 'desc' = 'asc';

    addedSortColumn: string = 'nom';
    addedSortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private projetService: ProjetService,
        private utilisateurProjetService: UtilisateurProjetService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                this.loadDownloadedModels();
                this.loadAddedModels(user.id);
            }
        });
    }

    loadDownloadedModels(): void {
        this.projetService.getDownloadedProjects().subscribe(models => {
            this.downloadedModels = models;
            console.log('Modèles téléchargés:', this.downloadedModels);
            // Assurez-vous que les modèles sont triés après le chargement
            this.sortData('nom', 'downloadedModels');
        });
    }

    loadAddedModels(userId: number): void {
        this.projetService.getProjectsByUserId(userId).subscribe(models => {
            this.addedModels = models;
            console.log('Modèles ajoutés:', this.addedModels);
            // Assurez-vous que les modèles sont triés après le chargement
            this.sortData('nom', 'addedModels');
        });
    }

    viewModelDetails(id: number): void {
        this.router.navigate(['/projet/detail/', id]);
    }

    deleteDownloadedModel(model: Projet): void {
        this.utilisateurProjetService.deleteDownloadedProjet(model.id).subscribe(() => {
            this.downloadedModels = this.downloadedModels.filter(m => m.id !== model.id);
            console.log('Modèle téléchargé supprimé', model);
        }, error => {
            console.error('Erreur lors de la suppression du modèle téléchargé', error);
        });
    }

    editModel(id: number): void {
        this.router.navigate(['/projet/update/', id]);
    }

    deleteAddedModel(model: Projet): void {
        this.projetService.deleteProjet(model.id).subscribe(() => {
            this.addedModels = this.addedModels.filter(m => m.id !== model.id);
            console.log('Modèle ajouté supprimé', model);
        });
    }

    sortData(column: string, listType: 'downloadedModels' | 'addedModels'): void {
        let sortColumn: string;
        let sortDirection: 'asc' | 'desc';
        let listToSort: Projet[];

        if (listType === 'downloadedModels') {
            sortColumn = this.downloadedSortColumn;
            sortDirection = this.downloadedSortDirection;
            listToSort = this.downloadedModels;
        } else {
            sortColumn = this.addedSortColumn;
            sortDirection = this.addedSortDirection;
            listToSort = this.addedModels;
        }

        console.log(`sortData called with column: ${column} and listType: ${listType}`);
        console.log(`Current sortColumn: ${sortColumn}, Current sortDirection: ${sortDirection}`);

        // Update sort direction or change sort column
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        console.log(`Updated sortColumn: ${sortColumn}, Updated sortDirection: ${sortDirection}`);

        listToSort.sort((a, b) => {
            let valueA = this.getNestedValue(a, column);
            let valueB = this.getNestedValue(b, column);

            console.log(`Sorting values for ${column}: valueA=${valueA}, valueB=${valueB}`);

            if (column === 'statistique.datePublication') {
                valueA = valueA ? new Date(valueA).getTime() : 0;
                valueB = valueB ? new Date(valueB).getTime() : 0;
                console.log(`Converted date values: valueA=${valueA}, valueB=${valueB}`);
            } else if (column === 'statut.nom') {
                valueA = this.getStatutValue(valueA);
                valueB = this.getStatutValue(valueB);
                console.log(`Converted statut values: valueA=${valueA}, valueB=${valueB}`);
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Assign sorted data and sort properties back
        if (listType === 'downloadedModels') {
            this.downloadedModels = [...listToSort];
            this.downloadedSortColumn = sortColumn;
            this.downloadedSortDirection = sortDirection;
            console.log('After sorting downloadedModels:', JSON.stringify(this.downloadedModels));
        } else {
            this.addedModels = [...listToSort];
            this.addedSortColumn = sortColumn;
            this.addedSortDirection = sortDirection;
            console.log('After sorting addedModels:', JSON.stringify(this.addedModels));
        }

        console.log(`Final sortColumn: ${sortColumn}, Final sortDirection: ${sortDirection}`);
    }

    getStatutValue(statut: string): number {
        if (statut) {
            switch (statut.toLowerCase()) {
                case 'valide': return 1;
                case 'invalide': return 2;
                case 'en attente': return 3;
                default: return 4;
            }
        }
        return 4; // Pour gérer les cas où le statut est indéfini
    }

    getNestedValue(obj: any, path: string): any {
        console.log('getNestedValue called with path:', path);
        const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
        console.log('getNestedValue result:', value);
        return value;
    }

    getSortIcon(column: string, listType: 'downloadedModels' | 'addedModels'): string {
        let sortColumn: string;
        let sortDirection: 'asc' | 'desc';

        if (listType === 'downloadedModels') {
            sortColumn = this.downloadedSortColumn;
            sortDirection = this.downloadedSortDirection;
        } else {
            sortColumn = this.addedSortColumn;
            sortDirection = this.addedSortDirection;
        }

        console.log(`getSortIcon called with column: ${column}, sortColumn: ${sortColumn}, sortDirection: ${sortDirection}`);

        if (sortColumn === column) {
            return sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
        }
        return 'bi-sort';  // Icône par défaut si la colonne n'est pas triée
    }
}

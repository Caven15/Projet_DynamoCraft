import { Component, OnInit } from '@angular/core';
import { Projet } from '../../../../../models/projet.model';
import { ProjetService } from '../../../../../tools/services/api/projet.service';
import { AuthService } from '../../../../../tools/services/api/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-bibliotheques',
    templateUrl: './bibliotheques.component.html',
    styleUrls: ['./bibliotheques.component.scss']
})
export class BibliothequesComponent implements OnInit {
    addedModels: Projet[] = [];

    addedSortColumn: string = 'nom';
    addedSortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private projetService: ProjetService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                this.loadAddedModels(user.id);
            }
        });
    }

    editModel(id: number): void {
        this.router.navigate(['/projet/update/', id]);
    }

    loadAddedModels(userId: number): void {
        this.projetService.getProjectsByUserId(userId).subscribe(models => {
            console.log("-------------------------------");
            console.log(models);
            console.log("-------------------------------");
            this.addedModels = models;
            console.log('Modèles ajoutés:', this.addedModels);
            this.sortData('nom', 'addedModels');
        });
    }

    viewModelDetails(id: number): void {
        this.router.navigate(['/projet/detail/', id]);
    }

    deleteAddedModel(model: Projet): void {
        this.projetService.deleteProjet(model.id).subscribe(() => {
            this.addedModels = this.addedModels.filter(m => m.id !== model.id);
            console.log('Modèle ajouté supprimé', model);
        });
    }

    sortData(column: string, listType: 'addedModels'): void {
        let sortColumn = this.addedSortColumn;
        let sortDirection = this.addedSortDirection;

        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        this.addedModels.sort((a, b) => {
            let valueA = this.getNestedValue(a, column);
            let valueB = this.getNestedValue(b, column);

            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            return (valueA < valueB) ? (sortDirection === 'asc' ? -1 : 1) :
                (valueA > valueB) ? (sortDirection === 'asc' ? 1 : -1) : 0;
        });

        this.addedSortColumn = sortColumn;
        this.addedSortDirection = sortDirection;
        console.log('After sorting addedModels:', JSON.stringify(this.addedModels));
    }

    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    getSortIcon(column: string): string {
        if (this.addedSortColumn === column) {
            return this.addedSortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
        }
        return 'bi-sort';
    }
}

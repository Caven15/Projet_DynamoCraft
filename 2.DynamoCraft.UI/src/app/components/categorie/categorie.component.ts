import { Component } from '@angular/core';
import { CategorieService } from '../../tools/services/api/categorie.service';
import { error } from 'console';
import { Categorie } from '../../models/categorie.model';

@Component({
    selector: 'app-categorie',
    templateUrl: './categorie.component.html',
    styleUrl: './categorie.component.scss'
})
export class CategorieComponent {

    categories!: Categorie[]

    constructor(categorieService: CategorieService) {
        categorieService.getAllCategorie().subscribe({
            next: (data) => {
                this.categories = data
            },
            error: (error) => {
                console.log("Erreur lor de la récupération des catégories");
            },
            complete: () => {
                console.log("Catégorie récupérée avec succès !");
            }
        })
    }
}

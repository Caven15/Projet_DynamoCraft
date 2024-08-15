import { Component } from '@angular/core';
import { categorie } from '../../models/categorie.model';
import { CategorieService } from '../../tools/services/api/categorie.service';
import { error } from 'console';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss'
})
export class CategorieComponent {

    categories! : categorie[]

    constructor( categorieService : CategorieService) {
        categorieService.getAllCategorie().subscribe({
            next : (data) => {
                this.categories = data
            },
            error : (error) => {
                console.log("Erreur lor de la récupération des catégories");
            },
            complete : () => {
                console.log("Catégorie récupérée avec succès !");
            }
        })
    }
}

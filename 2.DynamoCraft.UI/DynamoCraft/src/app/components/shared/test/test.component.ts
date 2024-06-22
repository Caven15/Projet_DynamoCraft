import { Component } from '@angular/core';
import { categorie } from '../../../models/categorie.model';
import { CategorieService } from '../../../tools/api/categorie.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    categories: categorie[] = [];
    chargementCategories = false;
    messageErreur = '';
    categorieAjoutee: categorie | null = null;
    categorieModifiee: categorie | null = null;
    categorieSupprimee = false;

    constructor(private categorieService: CategorieService) { }

    ngOnInit(): void {
        this.chargerCategories();
    }

    chargerCategories(): void {
        this.chargementCategories = true;
        this.categorieService.getAllCategorie().subscribe({
            next: (data) => {
                this.categories = data;
                this.chargementCategories = false;
            },
            error: (err) => {
                this.messageErreur = 'Erreur lors de la récupération des catégories';
                console.error(this.messageErreur, err);
                this.chargementCategories = false;
            }
        });
    }

    ajouterCategorie(): void {
        const nouvelleCategorie = new categorie('Nouvelle Catégorie');
        this.categorieService.postCategorie(nouvelleCategorie).subscribe({
            next: (data) => {
                this.categorieAjoutee = data;
                this.chargerCategories(); // Recharger les catégories pour inclure la nouvelle
            },
            error: (err) => {
                this.messageErreur = 'Erreur lors de l\'ajout de la catégorie';
                console.error(this.messageErreur, err);
            }
        });
    }

    modifierCategorie(): void {
        if (this.categories.length) {
            const categorieAModifier = this.categories[0];
            if (categorieAModifier.id === undefined) {
                this.messageErreur = 'ID de la catégorie à modifier est indéfini';
                console.error(this.messageErreur);
                return;
            }
            const categorieModifiee = new categorie('Catégorie Modifiée', categorieAModifier.id);
            this.categorieService.updateCategorie(categorieAModifier.id, categorieModifiee).subscribe({
                next: () => {
                    this.categorieModifiee = categorieModifiee;
                    this.chargerCategories(); // Recharger les catégories pour afficher la modification
                },
                error: (err) => {
                    this.messageErreur = 'Erreur lors de la modification de la catégorie';
                    console.error(this.messageErreur, err);
                }
            });
        }
    }

}

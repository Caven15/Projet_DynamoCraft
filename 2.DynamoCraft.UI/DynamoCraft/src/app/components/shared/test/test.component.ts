import { Component } from '@angular/core';
import { categorie } from '../../../models/categorie.model';
import { CategorieService } from '../../../tools/api/categorie.service';
import { Statistique } from '../../../models/statistique.model';
import { StatistiqueService } from '../../../tools/api/statistique.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    statistiques: Statistique[] = [];
    messageErreur = '';
    statistiqueAjoutee: Statistique | null = null;
    statistiqueModifiee: Statistique | null = null;
    totaux: any = null;

    constructor(private statistiqueService: StatistiqueService) { }

    ajouterStatistique(): void {
        const nouvelleStatistique = new Statistique(0, 0);
        this.statistiqueService.postStatistique(nouvelleStatistique).subscribe({
            next: (data) => {
                this.statistiqueAjoutee = data;
                console.log(`Statistique créée avec l'id=${data.id}`);
            },
            error: (err) => {
                this.messageErreur = 'Erreur lors de l\'ajout de la statistique';
                console.error(this.messageErreur, err);
            }
        });
    }

    modifierStatistique(): void {
        const statistiqueModifiee = new Statistique(
            25,
            25,
            new Date(),
            new Date(),
            1
        );
        this.statistiqueService.updateStatistique(1, statistiqueModifiee).subscribe({
            next: () => {
                this.statistiqueModifiee = statistiqueModifiee;
                console.log('Statistique modifiée avec succès !');
            },
            error: (err) => {
                this.messageErreur = 'Erreur lors de la modification de la statistique';
                console.error(this.messageErreur, err);
            }
        });
    }

    recupererTotaux(): void {
        this.statistiqueService.getTotalsStatistique().subscribe({
            next: (data) => {
                this.totaux = data[0]; // Assuming the response is an array with a single object
                console.log('Récupération des totaux réussie');
            },
            error: (err) => {
                this.messageErreur = 'Erreur lors de la récupération des totaux';
                console.error(this.messageErreur, err);
            }
        });
    }
}

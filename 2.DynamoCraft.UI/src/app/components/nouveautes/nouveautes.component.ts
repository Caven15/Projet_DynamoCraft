import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../tools/services/api/projet.service';
import { Projet } from '../../models/projet.model';
import { environment } from '../../../environments/environment.dev';

@Component({
    selector: 'app-nouveautes',
    templateUrl: './nouveautes.component.html',
    styleUrls: ['./nouveautes.component.scss']
})
export class NouveautesComponent implements OnInit {
    nouveautes!: Projet[];
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(private projetService: ProjetService) { }

    ngOnInit(): void {
        this.projetService.getLastProjects().subscribe({
            next: (data) => {
                this.nouveautes = data;
                // console.log(data);
                // data.forEach((projet, index) => {
                //     if (projet.ImageProjet && projet.ImageProjet.length > 0) {
                //         console.log(`${this.url}${projet.ImageProjet[0].nom}`);
                //     } else {
                //         console.log(`Projet ${index} n'a pas d'image.`);
                //     }
                // });
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {
                console.log("Projets récupérés avec succès !");
            }
        });
    }

    // logImageNames(projects: Projet[]): void {
    //     projects.forEach(projet => {
    //         if (projet.ImageProjet && projet.ImageProjet.length > 0) {
    //             projet.ImageProjet.forEach(image => {
    //                 console.log(`Nom de l'image du projet ${projet.id}: ${image.nom}`);
    //             });
    //         } else {
    //             console.log(`Le projet ${projet.id} n'a pas d'image associée.`);
    //         }
    //     });
    // }
}

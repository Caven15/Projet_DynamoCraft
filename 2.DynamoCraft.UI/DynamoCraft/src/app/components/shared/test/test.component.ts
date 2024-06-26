import { Component } from '@angular/core';
import { ImageProjetService } from '../../../tools/services/api/image-projet.service';
import { ImageProjet } from '../../../models/imageProjet.model';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    images: ImageProjet[] = [];
    selectedFiles: File[] = [];
    projetId: number = 1;

    constructor(private imageProjetService: ImageProjetService) {}

    ngOnInit(): void {
        this.getImages();
    }

    getImages(): void {
        this.imageProjetService.getImagesByProjetId(this.projetId).subscribe(
            (data: ImageProjet[]) => {
                this.images = data;
            },
            (error) => {
                console.error('Erreur lors de la récupération des images', error);
            }
        );
    }

    getImageUrl(imageName: string): string {
        return `http://localhost:3000/uploads/${imageName}`;
    }

    onFileSelected(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFiles = Array.from(event.target.files);
        }
    }

    addImages(): void {
        if (this.selectedFiles.length === 0) {
            console.error('Aucun fichier sélectionné');
            return;
        }

        this.imageProjetService.createImages(this.projetId, this.selectedFiles).subscribe(
            (response) => {
                console.log('Images ajoutées avec succès', response);
                this.getImages(); // Mettre à jour la liste des images
            },
            (error) => {
                console.error('Erreur lors de l\'ajout des images', error);
            }
        );
    }

    deleteImage(imageId: number): void {
        this.imageProjetService.deleteImage(imageId).subscribe(
            (response) => {
                console.log('Image supprimée avec succès', response);
                this.getImages(); // Mettre à jour la liste des images
            },
            (error) => {
                console.error('Erreur lors de la suppression de l\'image', error);
            }
        );
    }
}

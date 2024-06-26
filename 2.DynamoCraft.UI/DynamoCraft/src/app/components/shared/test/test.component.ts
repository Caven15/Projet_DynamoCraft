import { Component } from '@angular/core';
import { ImageUtilisateurService } from '../../../tools/services/api/image-utilisateur.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    selectedFile: File | null = null;
    message: string = '';

    constructor(private imageUtilisateurService: ImageUtilisateurService) { }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    addImage(utilisateurId: number): void {
        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('image', this.selectedFile, this.selectedFile.name);

            this.imageUtilisateurService.addImage(utilisateurId, formData).subscribe(
                () => this.message = `Image ajoutée pour l'utilisateur ${utilisateurId} avec succès !`,
                (error) => this.message = 'Erreur lors de l\'ajout de l\'image utilisateur'
            );
        }
    }

    updateImage(idUser: number): void {
        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('image', this.selectedFile, this.selectedFile.name);

            this.imageUtilisateurService.updateImage(idUser, formData).subscribe(
                () => this.message = `Image de l'utilisateur ${idUser} mise à jour avec succès !`,
                (error) => this.message = 'Erreur lors de la mise à jour de l\'image utilisateur'
            );
        }
    }

    deleteImage(idUser: number): void {
        this.imageUtilisateurService.deleteImage(idUser).subscribe(
            () => this.message = `Image de l'utilisateur ${idUser} supprimée avec succès !`,
            (error) => this.message = 'Erreur lors de la suppression de l\'image utilisateur'
        );
    }
}
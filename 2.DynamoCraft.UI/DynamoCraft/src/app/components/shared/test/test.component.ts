import { Component } from '@angular/core';
import { ImageProjetService } from '../../../tools/services/api/image-projet.service';
import { ImageProjet } from '../../../models/imageProjet.model';
import { Commentaire } from '../../../models/commentaire.model';
import { CommentaireService } from '../../../tools/services/api/commentaire.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    commentaires: Commentaire[] = [];
    selectedCommentaire: Commentaire = new Commentaire(0, '', new Date(), new Date(), 0, 1);
    newComment: Commentaire = new Commentaire(0, '', new Date(), new Date(), 0, 1);
    projetId: number = 1;
    editing: boolean = false;
    currentDescription: string = '';

    constructor(private commentaireService: CommentaireService) {}

    ngOnInit(): void {
        this.getCommentaires();
    }

    getCommentaires(): void {
        this.commentaireService.getCommentairesByProjetId(this.projetId).subscribe(
            (data: Commentaire[]) => {
                this.commentaires = data;
            },
            (error) => {
                console.error('Erreur lors de la récupération des commentaires', error);
            }
        );
    }

    addCommentaire(): void {
        if (this.editing) {
            this.updateCommentaire();
        } else {
            this.newComment.projetId = this.projetId;
            this.newComment.description = this.currentDescription;
            this.commentaireService.createCommentaire(this.newComment, this.newComment.utilisateurId).subscribe(
                (response) => {
                    console.log('Commentaire ajouté avec succès', response);
                    this.getCommentaires();
                    this.newComment.description = '';
                    this.currentDescription = '';
                },
                (error) => {
                    console.error('Erreur lors de l\'ajout du commentaire', error);
                }
            );
        }
    }

    editCommentaire(commentaire: Commentaire): void {
        this.selectedCommentaire = { ...commentaire };
        this.currentDescription = commentaire.description;
        this.editing = true;
    }

    updateCommentaire(): void {
        this.selectedCommentaire.description = this.currentDescription;
        this.commentaireService.updateCommentaire(this.selectedCommentaire.id, this.selectedCommentaire).subscribe(
            (response) => {
                console.log('Commentaire mis à jour avec succès', response);
                this.getCommentaires();
                this.selectedCommentaire = new Commentaire(0, '', new Date(), new Date(), 0, 1);
                this.editing = false;
                this.currentDescription = '';
            },
            (error) => {
                console.error('Erreur lors de la mise à jour du commentaire', error);
            }
        );
    }

    deleteCommentaire(commentaireId: number): void {
        this.commentaireService.deleteCommentaire(commentaireId).subscribe(
            (response) => {
                console.log('Commentaire supprimé avec succès', response);
                this.getCommentaires();
            },
            (error) => {
                console.error('Erreur lors de la suppression du commentaire', error);
            }
        );
    }

    cancelEditing(): void {
        this.editing = false;
        this.selectedCommentaire = new Commentaire(0, '', new Date(), new Date(), 0, 1);
        this.currentDescription = '';
    }
}

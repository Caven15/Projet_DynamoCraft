import { Component } from '@angular/core';
import { Projet } from '../../../../models/projet.model';
import { Commentaire } from '../../../../models/commentaire.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { CommentaireService } from '../../../../tools/services/api/commentaire.service';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.dev';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
    projet!: Projet;
    commentaires: Commentaire[] = [];
    newCommentaire: string = '';
    currentUser: Utilisateur | null = null;
    editingCommentId: number | null = null;
    editingCommentContent: string = '';
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(
        private projetService: ProjetService,
        private commentaireService: CommentaireService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const projetId = this.route.snapshot.params['id'];
        this.loadProjet(projetId);
        this.loadCommentaires(projetId);

        // Charger l'utilisateur connecté
        this.authService.currentUser$.subscribe(user => this.currentUser = user);
    }

    loadProjet(id: number): void {
        this.projetService.getProjetById(id).subscribe(projet => {
            this.projet = projet;
            console.log(projet);

            // Initialiser imageProjet comme tableau vide si undefined
            if (!this.projet.imageProjet) {
                this.projet.imageProjet = [];
            } else if (!Array.isArray(this.projet.imageProjet)) {
                this.projet.imageProjet = [this.projet.imageProjet];
            }
        });
    }

    loadCommentaires(projetId: number): void {
        this.commentaireService.getCommentairesByProjetId(projetId).subscribe(comments => this.commentaires = comments);
    }

    addComment(): void {
        if (!this.newCommentaire.trim()) return;

        if (!this.currentUser || !this.currentUser.id) {
            this.router.navigate(['/auth/login']);
            return;
        }

        const commentaire: Commentaire = {
            description: this.newCommentaire,
            utilisateurId: this.currentUser.id,
            projetId: this.projet.id
        };

        this.commentaireService.createCommentaire(commentaire, this.currentUser.id)
            .subscribe(newComment => {
                this.commentaires.push(newComment);
                this.newCommentaire = '';
                this.loadCommentaires(this.projet.id);
            });
    }

    incrementLike(): void {
        this.projetService.incrementLike(this.projet.id).subscribe(() => this.projet.statistique!.nombreApreciation++);
    }

    incrementDownload(): void {
        this.projetService.incrementDownload(this.projet.id).subscribe(() => this.projet.statistique!.nombreTelechargement++);
    }

    editComment(comment: Commentaire): void {
        this.editingCommentId = comment.id || null;
        this.editingCommentContent = comment.description;
    }

    saveComment(): void {
        if (this.editingCommentId && this.editingCommentContent.trim()) {
            const updatedComment: Commentaire = {
                ...this.commentaires.find(c => c.id === this.editingCommentId)!,
                description: this.editingCommentContent
            };

            this.commentaireService.updateCommentaire(this.editingCommentId, updatedComment)
                .subscribe(() => {
                    this.loadCommentaires(this.projet.id);
                    this.cancelEdit();
                });
        }
    }

    cancelEdit(): void {
        this.editingCommentId = null;
        this.editingCommentContent = '';
    }

    deleteComment(commentId: number | undefined): void {
        if (commentId !== undefined) {
            this.commentaireService.deleteCommentaire(commentId).subscribe(() => {
                this.commentaires = this.commentaires.filter(c => c.id !== commentId);
            });
        }
    }

    selectImage(index: number): void {
        const carousel = document.querySelector('#mainImageCarousel') as HTMLElement;
        if (carousel) {
            const carouselInstance = new (window as any).bootstrap.Carousel(carousel);
            carouselInstance.to(index);
        }
    }
}

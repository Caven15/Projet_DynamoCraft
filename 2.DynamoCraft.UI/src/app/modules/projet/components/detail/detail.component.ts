import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Projet } from '../../../../models/projet.model';
import { Commentaire } from '../../../../models/commentaire.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { CommentaireService } from '../../../../tools/services/api/commentaire.service';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.dev';
import { Display3dService } from '../../../../tools/services/other/display-3d.service';
import { Modele3dService } from '../../../../tools/services/api/modele-3d.service';
import { Modele3D } from '../../../../models/modele-3d.model';
import { UtilisateurProjetService } from '../../../../tools/services/api/utilisateur-projet.service';
import { UtilisateurProjetLikeService } from '../../../../tools/services/api/utilisateur-projet-like.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewChecked {
    @ViewChild('threeContainer', { static: false }) threeContainer!: ElementRef;

    projet!: Projet;
    commentaires: Commentaire[] = [];
    newCommentaire: string = '';
    currentUser: Utilisateur | null = null;
    editingCommentId: number | null = null;
    editingCommentContent: string = '';
    url: string = `${environment.apiUrl}/uploads/`;

    activeIndex: number = 0;
    active3DModelIndex: number = 0;
    thumbnailStartIndex: number = 0;
    visibleThumbnails: any[] = [];
    combinedThumbnails: any[] = [];
    selected3DFiles: Modele3D[] = [];
    is3DModelActive: boolean = false;
    private isThreeJSInitialized = false;

    hasLiked: boolean = false;
    isDownloading: boolean = false;
    downloadCountdown: number = 5;

    constructor(
        private projetService: ProjetService,
        private commentaireService: CommentaireService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private display3dService: Display3dService,
        private modele3dService: Modele3dService,
        private cdr: ChangeDetectorRef,
        private utilisateurProjetService: UtilisateurProjetService,
        private utilisateurProjetLikeService: UtilisateurProjetLikeService,
    ) { }

    ngOnInit(): void {
        const projetId = this.route.snapshot.params['id'];
        this.loadProjet(projetId);
        this.loadCommentaires(projetId);
        this.loadModeles3D(projetId);

        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (user) {
                this.checkIfUserHasLiked(projetId);
            }
        });

        // Gérer le commentaire spécifié par l'ID (query param)
        this.route.queryParams.subscribe(params => {
            const commentId = params['commentId'];
            if (commentId) {
                this.scrollToComment(commentId);
            }
        });
    }

    ngAfterViewChecked(): void {
        if (this.is3DModelActive && this.threeContainer?.nativeElement && !this.isThreeJSInitialized) {
            this.isThreeJSInitialized = true;
            setTimeout(() => {
                this.load3DModel(this.selected3DFiles[this.active3DModelIndex].nom);
            }, 50);
        }
    }

    loadProjet(id: number): void {
        this.projetService.getProjetById(id).subscribe(projet => {
            this.projet = projet;
            this.projet.imageProjet = this.projet.imageProjet || [];
            this.updateCombinedThumbnails();
            this.updateVisibleThumbnails();
        });
    }

    loadCommentaires(projetId: number): void {
        this.commentaireService.getCommentairesByProjetId(projetId).subscribe(comments => this.commentaires = comments);
    }

    loadModeles3D(projetId: number): void {
        this.modele3dService.getModeles3DByProjetId(projetId).subscribe(modeles3D => {
            this.selected3DFiles = modeles3D;
            this.updateCombinedThumbnails();
            this.updateVisibleThumbnails();
        });
    }

    updateCombinedThumbnails(): void {
        this.combinedThumbnails = [...this.projet.imageProjet!, ...this.selected3DFiles];
    }

    updateVisibleThumbnails(): void {
        this.visibleThumbnails = this.combinedThumbnails.slice(this.thumbnailStartIndex, this.thumbnailStartIndex + 6);
    }

    setActiveImage(index: number): void {
        this.is3DModelActive = false;
        this.activeIndex = index;
    }

    setActive3DModel(index: number): void {
        const item = this.combinedThumbnails[index];
        if (item && item.nom.endsWith('.stl')) {
            const filteredIndex = this.selected3DFiles.findIndex(file => file.nom === item.nom);
            if (filteredIndex < 0 || filteredIndex >= this.selected3DFiles.length) {
                console.error('Index de modèle 3D invalide :', filteredIndex);
                return;
            }
            this.is3DModelActive = true;
            this.active3DModelIndex = filteredIndex;
            this.isThreeJSInitialized = false;
            this.cdr.detectChanges();
        } else {
            console.error('L\'élément cliqué n\'est pas un modèle 3D.');
        }
    }

    load3DModel(fileName: string): void {
        const url = `${this.url}${fileName}`;
        if (!this.threeContainer || !this.threeContainer.nativeElement) {
            console.error('Conteneur Three.js introuvable.');
            return;
        }
        setTimeout(() => {
            this.display3dService.initThree([this.threeContainer]);
            this.display3dService.chargerModele(url, 0);
        }, 50);
    }

    toggleView(): void {
        if (this.is3DModelActive) {
            this.is3DModelActive = false;
            this.activeIndex = 0;
        } else {
            this.is3DModelActive = true;
            this.active3DModelIndex = 0;
            this.isThreeJSInitialized = false;
            this.cdr.detectChanges();
        }
    }

    scrollLeft(): void {
        if (this.thumbnailStartIndex > 0) {
            this.thumbnailStartIndex -= 1;
            this.updateVisibleThumbnails();
        }
    }

    scrollRight(): void {
        if (this.thumbnailStartIndex + 6 < this.combinedThumbnails.length) {
            this.thumbnailStartIndex += 1;
            this.updateVisibleThumbnails();
        }
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

    checkIfUserHasLiked(projetId: number): void {
        this.utilisateurProjetLikeService.hasLiked(projetId).subscribe(response => {
            this.hasLiked = response.hasLiked;
        });
    }

    incrementLike(): void {
        if (!this.currentUser || !this.currentUser.id) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.hasLiked) return;

        this.projetService.incrementLike(this.projet.id).subscribe(() => {
            this.projet.statistique!.nombreApreciation++;
            this.hasLiked = true;
        });
    }

    download(): void {
        if (!this.currentUser || !this.currentUser.id) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.isDownloading) return;

        this.isDownloading = true;
        const interval = setInterval(() => {
            this.downloadCountdown--;

            if (this.downloadCountdown === 0) {
                clearInterval(interval);

                this.utilisateurProjetService.downloadProjet(this.projet.id).subscribe(
                    (blob) => {
                        const a = document.createElement('a');
                        const objectUrl = URL.createObjectURL(blob);
                        a.href = objectUrl;
                        a.download = `${this.projet.nom}.zip`;
                        a.click();
                        URL.revokeObjectURL(objectUrl);

                        this.isDownloading = false;
                        this.downloadCountdown = 5;
                    },
                    (error) => {
                        console.error('Erreur lors du téléchargement du projet:', error);
                        this.isDownloading = false;
                        this.downloadCountdown = 5;
                    }
                );
            }
        }, 1000);
    }

    navigateToUserProfile(userId: number | undefined): void {
        this.router.navigate([`/profil/${userId}`]);
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

    navigateToUpdatePage(projetId: number): void {
        this.router.navigate([`/projet/update/${projetId}`]);
    }

    formatFileName(fileName: string): string {
        if (!fileName) return '';

        const parts = fileName.split('-');
        return parts.length > 1 ? parts[1].split('.')[0] : parts[0].split('.')[0];
    }

    scrollToComment(commentId: number): void {
        setTimeout(() => {
            const element = document.getElementById(`comment-${commentId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                element.classList.add('highlight-comment');
                setTimeout(() => element.classList.remove('highlight-comment'), 3000);
            }
        }, 500);
    }
}

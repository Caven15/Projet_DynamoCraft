import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Commentaire } from '../../../models/commentaire.model';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommentaireService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Créer un nouveau commentaire
     * @param commentaire Objet commentaire à créer
     * @returns Observable contenant le commentaire créé
     */
    createCommentaire(commentaire: Commentaire): Observable<Commentaire> {
        return this.post<Commentaire>('comentaire', commentaire).pipe(
            map(response => response)
        );
    }

    /**
     * Récupérer tous les commentaires pour un projet donné
     * @param projetId Identifiant du projet
     * @returns Observable contenant la liste des commentaires
     */
    getCommentairesByProjetId(projetId: number): Observable<Commentaire[]> {
        return this.get<{ commentaires: Commentaire[] }>(`comentaire/${projetId}/projet`).pipe(
            map(response => response.commentaires)
        );
    }

    /**
     * Mettre à jour un commentaire par ID
     * @param commentaireId Identifiant du commentaire
     * @param commentaire Objet contenant les nouvelles informations du commentaire
     * @returns Observable contenant le commentaire mis à jour
     */
    updateCommentaire(commentaireId: number, commentaire: Commentaire): Observable<Commentaire> {
        return this.put<Commentaire>(`comentaire/${commentaireId}`, commentaire).pipe(
            map(response => response)
        );
    }

    /**
     * Supprimer un commentaire par ID
     * @param commentaireId Identifiant du commentaire
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteCommentaire(commentaireId: number): Observable<void> {
        return this.delete<void>(`comentaire/${commentaireId}`).pipe(
            map(response => response)
        );
    }

    /**
     * Récupérer tous les commentaires postés par un utilisateur donné
     * @returns Observable contenant la liste des commentaires
     */
    getCommentairesByUtilisateurId(): Observable<Commentaire[]> {
        return this.get<{ commentaires: Commentaire[] }>(`comentaires/utilisateur`).pipe(
            map(response => response.commentaires)
        );
    }
}

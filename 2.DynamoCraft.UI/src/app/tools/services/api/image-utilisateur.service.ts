import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilisateurService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Ajouter une image utilisateur
     * @param id Identifiant de l'utilisateur
     * @param image FormData contenant l'image à uploader
     * @returns Observable indiquant le résultat de l'opération
     */
    addImage(id: number, image: FormData): Observable<any> {
        return this.post(`imageUtilisateur/${id}/utilisateur`, image).pipe(
            tap({
                next: () => console.log(`Image ajoutée pour l'utilisateur avec l'id=${id}`),
                error: (error) => console.error(`Erreur lors de l'ajout de l'image pour l'utilisateur avec l'id=${id}:`, error)
            }),
            catchError(this.handleError<any>('addImage'))
        );
    }

    /**
     * Mettre à jour une image utilisateur
     * @param id Identifiant de l'image utilisateur
     * @param image FormData contenant la nouvelle image à uploader
     * @returns Observable indiquant le résultat de l'opération
     */
    updateImage(id: number, image: FormData): Observable<any> {
        return this.put(`imageUtilisateur/${id}/utilisateur`, image).pipe(
            tap({
                next: () => console.log(`Image mise à jour pour l'utilisateur avec l'id=${id}`),
                error: (error) => console.error(`Erreur lors de la mise à jour de l'image pour l'utilisateur avec l'id=${id}:`, error)
            }),
            catchError(this.handleError<any>('updateImage'))
        );
    }

    /**
     * Supprimer une image utilisateur
     * @param id Identifiant de l'image utilisateur
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteImage(id: number): Observable<any> {
        return this.delete(`imageUtilisateur/${id}/utilisateur`).pipe(
            tap({
                next: () => console.log(`Image utilisateur id=${id} supprimée`),
                error: (error) => console.error(`Erreur lors de la suppression de l'image utilisateur avec l'id=${id}:`, error)
            }),
            catchError(this.handleError<any>('deleteImage'))
        );
    }
}

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
     * @param image FormData contenant l'image à uploader
     * @returns Observable indiquant le résultat de l'opération
     */
    addImage(image: FormData): Observable<any> {
        return this.post('imageUtilisateur', image).pipe(
            tap({
                next: () => console.log('Image ajoutée pour l\'utilisateur'),
                error: (error) => console.error('Erreur lors de l\'ajout de l\'image pour l\'utilisateur:', error)
            }),
            catchError(this.handleError<any>('addImage'))
        );
    }

    /**
     * Mettre à jour une image utilisateur
     * @param image FormData contenant la nouvelle image à uploader
     * @returns Observable indiquant le résultat de l'opération
     */
    updateImage(image: FormData): Observable<any> {
        return this.put('imageUtilisateur', image).pipe(
            tap({
                next: () => console.log('Image mise à jour pour l\'utilisateur'),
                error: (error) => console.error('Erreur lors de la mise à jour de l\'image pour l\'utilisateur:', error)
            }),
            catchError(this.handleError<any>('updateImage'))
        );
    }

    /**
     * Supprimer une image utilisateur
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteImage(): Observable<any> {
        return this.delete('imageUtilisateur').pipe(
            tap({
                next: () => console.log('Image utilisateur supprimée'),
                error: (error) => console.error('Erreur lors de la suppression de l\'image utilisateur:', error)
            }),
            catchError(this.handleError<any>('deleteImage'))
        );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageProjet } from '../../../models/imageProjet.model';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({
    providedIn: 'root'
})
export class ImageProjetService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Récupérer les images d'un projet par ID de projet
     * @param projetId Identifiant du projet
     * @returns Observable contenant un tableau d'ImageProjet
     */
    getImagesByProjetId(projetId: number): Observable<ImageProjet[]> {
        return this.get<{ images: ImageProjet[] }>(`imagesProjet/${projetId}/projet`).pipe(
            map(response => response.images),
            catchError(this.handleError<ImageProjet[]>('getImagesByProjetId'))
        );
    }

    /**
     * Ajouter des images à un projet
     * @param projetId Identifiant du projet
     * @param files Liste des fichiers à ajouter
     * @returns Observable contenant la liste des images ajoutées
     */
    createImages(projetId: number, files: File[]): Observable<ImageProjet[]> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file, file.name));
        return this.post<ImageProjet[]>(`imageProjet/${projetId}/projet`, formData);
    }

    /**
     * Supprimer une image par ID
     * @param imageId Identifiant de l'image à supprimer
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteImage(imageId: number): Observable<void> {
        return this.delete<void>(`imageProjet/${imageId}`);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { categorie } from '../../../models/categorie.model';

@Injectable({
    providedIn: 'root'
})
export class CategorieService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Récupérer toutes les catégories
     * @returns Observable contenant la liste des catégories
     */
    getAllCategorie(): Observable<categorie[]> {
        return this.getAll<categorie>('categories').pipe(
            tap({
                next: () => console.log('Récupération de toutes les catégories'),
                error: (error) => console.error('Erreur lors de la récupération de toutes les catégories :', error)
            }),
            catchError(this.handleError<categorie[]>('getAllCategorie'))
        );
    }

    /**
     * Récupérer une catégorie par ID
     * @param id Identifiant de la catégorie
     * @returns Observable contenant la catégorie demandée
     */
    getCategorieById(id: number): Observable<categorie> {
        return this.get<categorie>(`categorie/${id}`).pipe(
            tap({
                next: () => console.log(`Récupération de la catégorie id=${id}`),
                error: (error) => console.error(`Erreur lors de la récupération de la catégorie id=${id} :`, error)
            }),
            catchError(this.handleError<categorie>('getCategorieById'))
        );
    }

    /**
     * Créer une nouvelle catégorie
     * @param categorie Objet contenant les informations de la nouvelle catégorie
     * @returns Observable contenant la catégorie créée
     */
    postCategorie(categorie: categorie): Observable<categorie> {
        return this.post<categorie>('categorie', categorie).pipe(
            tap({
                next: (newCategorie: categorie) => console.log(`Catégorie créée avec l'id=${newCategorie.id}`),
                error: (error) => console.error('Erreur lors de la création de la catégorie :', error)
            }),
            catchError(this.handleError<categorie>('postCategorie'))
        );
    }

    /**
     * Mettre à jour une catégorie par ID
     * @param id Identifiant de la catégorie
     * @param categorie Objet contenant les nouvelles informations de la catégorie
     * @returns Observable indiquant le résultat de l'opération
     */
    updateCategorie(id: number, categorie: categorie): Observable<any> {
        return this.put<any>(`categorie/${id}`, categorie).pipe(
            tap({
                next: () => console.log(`Catégorie id=${id} mise à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour de la catégorie id=${id} :`, error)
            }),
            catchError(this.handleError<any>('updateCategorie'))
        );
    }
}

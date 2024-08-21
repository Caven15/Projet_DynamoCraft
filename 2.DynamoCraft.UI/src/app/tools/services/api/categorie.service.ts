import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Categorie } from '../../../models/categorie.model';

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
    getAllCategorie(): Observable<Categorie[]> {
        return this.getAll<Categorie>('categories').pipe(
            tap({
                next: () => console.log('Récupération de toutes les catégories'),
                error: (error) => console.error('Erreur lors de la récupération de toutes les catégories :', error)
            }),
            catchError(this.handleError<Categorie[]>('getAllCategorie'))
        );
    }

    /**
     * Récupérer une catégorie par ID
     * @param Id Identifiant de la catégorie
     * @returns Observable contenant la catégorie demandée
     */
    getCategorieById(Id: number): Observable<Categorie> {
        return this.get<Categorie>(`categorie/${Id}`).pipe(
            tap({
                next: () => console.log(`Récupération de la catégorie Id=${Id}`),
                error: (error) => console.error(`Erreur lors de la récupération de la catégorie Id=${Id} :`, error)
            }),
            catchError(this.handleError<Categorie>('getCategorieById'))
        );
    }

    /**
     * Créer une nouvelle catégorie
     * @param Categorie Objet contenant les informations de la nouvelle catégorie
     * @returns Observable contenant la catégorie créée
     */
    postCategorie(Categorie: Categorie): Observable<Categorie> {
        return this.post<Categorie>('categorie', Categorie).pipe(
            tap({
                next: (newCategorie: Categorie) => console.log(`Catégorie créée avec l'Id=${newCategorie.id}`),
                error: (error) => console.error('Erreur lors de la création de la catégorie :', error)
            }),
            catchError(this.handleError<Categorie>('postCategorie'))
        );
    }

    /**
     * Mettre à jour une catégorie par ID
     * @param Id Identifiant de la catégorie
     * @param Categorie Objet contenant les nouvelles informations de la catégorie
     * @returns Observable indiquant le résultat de l'opération
     */
    updateCategorie(Id: number, Categorie: Categorie): Observable<any> {
        return this.put<any>(`categorie/${Id}`, Categorie).pipe(
            tap({
                next: () => console.log(`Catégorie Id=${Id} mise à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour de la catégorie Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('updateCategorie'))
        );
    }
}

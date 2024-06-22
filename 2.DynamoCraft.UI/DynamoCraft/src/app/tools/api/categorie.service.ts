import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { categorie } from '../../models/categorie.model';
import { environment } from '../../../environments/environment.dev';
import { BaseApiService } from './base-api.service';

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
            tap(() => console.log('Récupération de toutes les catégories'))
        );
    }

    /**
     * Récupérer une catégorie par ID
     * @param id Identifiant de la catégorie
     * @returns Observable contenant la catégorie demandée
     */
    getCategorieById(id: number): Observable<categorie> {
        return this.get<categorie>(`categorie/${id}`).pipe(
            tap(() => console.log(`Récupération de la catégorie id=${id}`))
        );
    }

    /**
     * Créer une nouvelle catégorie
     * @param categorie Objet contenant les informations de la nouvelle catégorie
     * @returns Observable contenant la catégorie créée
     */
    postCategorie(categorie: categorie): Observable<categorie> {
        return this.post<categorie>('categorie', categorie).pipe(
            tap((newCategorie: categorie) => console.log(`Catégorie créée avec l'id=${newCategorie.id}`))
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
            tap(() => console.log(`Catégorie id=${id} mise à jour`))
        );
    }
}
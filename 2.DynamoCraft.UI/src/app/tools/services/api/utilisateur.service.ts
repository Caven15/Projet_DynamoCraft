import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, map } from 'rxjs';
import { Utilisateur } from '../../../models/utilisateur.model';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Récupérer tous les utilisateurs
     * @returns Observable contenant la liste des utilisateurs
     */
    getAllUtilisateurs(): Observable<Utilisateur[]> {
        return this.getAll<Utilisateur>('utilisateurs').pipe(
            tap({
                next: () => console.log('Récupération de tous les utilisateurs'),
                error: (error) => console.error('Erreur lors de la récupération de tous les utilisateurs :', error)
            }),
            catchError(this.handleError<Utilisateur[]>('getAllUtilisateurs'))
        );
    }

    /**
     * Récupérer un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @returns Observable contenant les informations de l'utilisateur
     */
    getUtilisateurById(id: number): Observable<Utilisateur> {
        return this.get<Utilisateur>(`utilisateur/${id}`).pipe(
            tap({
                next: () => console.log(`Récupération de l'utilisateur avec l'id=${id}`),
                error: (error) => console.error(`Erreur lors de la récupération de l'utilisateur avec l'id=${id} :`, error)
            }),
            map((user: Utilisateur) => {
                // Adapter chaque projet pour que imageProjet soit un tableau, même si un seul objet est présent
                if (user.projet) {
                    user.projet = user.projet.map(projet => {
                        // Si imageProjet est un objet, le convertir en tableau
                        if (projet.imageProjet && !Array.isArray(projet.imageProjet)) {
                            projet.imageProjet = [projet.imageProjet];
                        }
                        return projet;
                    });
                }
                return user;
            }),
            catchError(this.handleError<Utilisateur>('getUtilisateurById'))
        );
    }
    /**
     * Mettre à jour un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @param utilisateur Objet contenant les nouvelles informations de l'utilisateur sous forme de FormData
     * @returns Observable indiquant le résultat de l'opération
     */
    updateUtilisateur(id: number, utilisateur: FormData): Observable<any> {
        return this.put(`utilisateur/${id}`, utilisateur).pipe(
            tap({
                next: () => console.log(`Utilisateur id=${id} mis à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour de l'utilisateur id=${id} :`, error)
            }),
            catchError(this.handleError<any>('updateUtilisateur'))
        );
    }

    /**
     * Supprimer un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteUtilisateur(id: number): Observable<any> {
        return this.delete<any>(`utilisateur/${id}`).pipe(
            tap({
                next: () => console.log(`Utilisateur id=${id} supprimé`),
                error: (error) => console.error(`Erreur lors de la suppression de l'utilisateur id=${id} :`, error)
            }),
            catchError(this.handleError<any>('deleteUtilisateur'))
        );
    }
}

import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
            tap(() => console.log('Récupération de tous les utilisateurs'))
        );
    }

    /**
     * Récupérer un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @returns Observable contenant les informations de l'utilisateur
     */
    getUtilisateurById(id: number): Observable<Utilisateur> {
        return this.get<Utilisateur>(`utilisateur/${id}`).pipe(
            tap(() => console.log(`Récupération de l'utilisateur avec l'id=${id}`))
        );
    }

    /**
     * Mettre à jour un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @param utilisateur Objet contenant les nouvelles informations de l'utilisateur
     * @returns Observable indiquant le résultat de l'opération
     */
    updateUtilisateur(id: number, utilisateur: Utilisateur): Observable<any> {
        return this.put<any>(`utilisateur/${id}`, utilisateur).pipe(
            tap(() => console.log(`Utilisateur id=${id} mis à jour`))
        );
    }

    /**
     * Supprimer un utilisateur par ID
     * @param id Identifiant de l'utilisateur
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteUtilisateur(id: number): Observable<any> {
        return this.delete<any>(`utilisateur/${id}`).pipe(
            tap(() => console.log(`Utilisateur id=${id} supprimé`))
        );
    }
}

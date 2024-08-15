import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Modele3D } from '../../../models/modele-3d.model';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Modele3dService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Créer des nouveaux modèles 3D
     * @param projetId Identifiant du projet
     * @param files Fichiers des modèles 3D à ajouter
     * @returns Observable contenant les modèles 3D créés
     */
    createModeles3D(projetId: number, files: File[]): Observable<Modele3D[]> {
        const formData: FormData = new FormData();
        formData.append('projetId', projetId.toString());
        files.forEach(file => formData.append('files', file, file.name));
        return this.post<Modele3D[]>('modeles3d', formData);
    }

    /**
     * Récupérer tous les modèles 3D pour un projet donné
     * @param projetId Identifiant du projet
     * @returns Observable contenant la liste des modèles 3D
     */
    getModeles3DByProjetId(projetId: number): Observable<Modele3D[]> {
        return this.get<{ modeles3D: Modele3D[] }>(`modeles3d/${projetId}/projet`).pipe(
            map(response => response.modeles3D)
        );
    }

    /**
     * Supprimer un modèle 3D par ID
     * @param modele3DId Identifiant du modèle 3D
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteModele3D(modele3DId: number): Observable<void> {
        return this.delete<void>(`modeles3d/${modele3DId}`);
    }
}

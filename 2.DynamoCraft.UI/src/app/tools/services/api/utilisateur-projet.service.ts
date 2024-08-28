import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Utilisateur } from '../../../models/utilisateur.model';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurProjetService extends BaseApiService {
    constructor(
        protected override httpClient: HttpClient,
        private authService: AuthService
    ) {
        super(httpClient);
    }

    downloadProjet(projetId: number): Observable<Blob> {
        const headers = this.httpOptions.headers.set('Accept', 'application/zip');

        return this.authService.currentUser$.pipe(
            switchMap((user: Utilisateur | null): Observable<Blob> => {
                if (!user) {
                    throw new Error('Utilisateur non connecté');
                }
                const endpoint = `utilisateurProjet/${projetId}/download?utilisateurId=${user.id}`;
                return this.httpClient.get(`${this.baseUrl}/${endpoint}`, { headers, responseType: 'blob' });
            })
        );
    }
}

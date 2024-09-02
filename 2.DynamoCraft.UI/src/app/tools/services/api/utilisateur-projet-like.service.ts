import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Utilisateur } from '../../../models/utilisateur.model';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurProjetLikeService extends BaseApiService {
    constructor(
        protected override httpClient: HttpClient,
        private authService: AuthService
    ) {
        super(httpClient);
    }

    hasLiked(projetId: number): Observable<{ hasLiked: boolean }> {
        return this.authService.currentUser$.pipe(
            switchMap((user: Utilisateur | null): Observable<{ hasLiked: boolean }> => {
                if (!user) {
                    throw new Error('Utilisateur non connecté');
                }
                const endpoint = `projet/${projetId}/hasLiked`;
                return this.httpClient.get<{ hasLiked: boolean }>(`${this.baseUrl}/${endpoint}`);
            })
        );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { AuthService } from './auth.service';

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
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error("Utilisateur non connecté");
        }

        const endpoint = `projet/${projetId}/utilisateur/${currentUser.id}/hasLiked`;
        return this.httpClient.get<{ hasLiked: boolean }>(`${this.baseUrl}/${endpoint}`, this.httpOptions);
    }
}

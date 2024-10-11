import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilisateur } from '../../../models/utilisateur.model';
import { AuthService } from '../api/auth.service';
import { UtilisateurService } from '../api/utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(
        private authService: AuthService,
        private utilisateurService: UtilisateurService
    ) { }

    /**
     * Charge l'utilisateur à partir du token et met à jour le sujet actuel de l'utilisateur
     */
    loadUserFromToken(): void {
        const token = this.authService.getToken();
        if (token) {
            const userId = this.authService.decodeTokenToGetUserId(token);
            if (userId) {
                this.utilisateurService.getUtilisateurById(userId).subscribe({
                    next: (user) => {
                        user.roleId = user.role?.id;
                        this.authService.currentUserSubject.next(user);
                    },
                    error: () => {
                        this.authService.logout(); // Déconnexion en cas d'échec
                    }
                });
            }
        }
    }
}

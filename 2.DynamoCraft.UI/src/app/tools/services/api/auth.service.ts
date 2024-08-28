import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Utilisateur } from '../../../models/utilisateur.model';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { UtilisateurService } from './utilisateur.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseApiService {
    private readonly tokenKey = 'authToken';
    private currentUserSubject: BehaviorSubject<Utilisateur | null>;

    constructor(protected override httpClient: HttpClient, private utilisateurService: UtilisateurService) {
        super(httpClient);
        this.currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
    }

    /**
     * Obtenir l'utilisateur actuel en tant qu'Observable
     * @returns Observable de l'utilisateur connecté
     */
    get currentUser$(): Observable<Utilisateur | null> {
        return this.currentUserSubject.asObservable();
    }

    /**
     * Connexion de l'utilisateur
     * @param email Email de l'utilisateur
     * @param password Mot de passe de l'utilisateur
     * @returns Observable contenant l'access token
     */
    login(email: string, password: string): Observable<{ accessToken: string, id: string, roleId: string }> {
        const utilisateur = new Utilisateur(email, password);
        return this.post<{ accessToken: string, id: string, roleId: string }>('auth/login', utilisateur).pipe(
            tap(response => {
                // Mettre à jour le BehaviorSubject avec les nouvelles données utilisateur
                this.utilisateurService.getUtilisateurById(parseInt(response.id)).subscribe({
                    next: (datas) => {
                        this.currentUserSubject.next(datas);
                    }
                })
                // // Stocker le token JWT et les informations utilisateur dans le sessionStorage
                // sessionStorage.setItem('token', response.accessToken);
                // sessionStorage.setItem('idUser', JSON.stringify(response.id));
                // sessionStorage.setItem('roleId', JSON.stringify(response.roleId));
                console.log('Utilisateur connecté avec succès');
            }),
            catchError(this.handleError<{ accessToken: string, id: string, roleId: string }>('login'))
        );
    }

    /**
     * Inscription de l'utilisateur
     * @param formData FormData contenant les données de l'utilisateur et l'image
     * @returns Observable contenant l'ID de l'utilisateur enregistré
     */
    register(formData: FormData): Observable<{ utilisateurId: number }> {
        return this.post<{ utilisateurId: number }>('auth/register', formData).pipe(
            tap(() => console.log('Utilisateur enregistré avec succès')),
            catchError(this.handleError<{ utilisateurId: number }>('register'))
        );
    }

    /**
 * Réinitialisation du mot de passe de l'utilisateur
 * @param oldPassword Ancien mot de passe
 * @param newPassword Nouveau mot de passe
 * @returns Observable indiquant le succès ou l'échec de l'opération
 */
    resetPassword(oldPassword: string, newPassword: string): Observable<any> {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return throwError(() => new Error('Utilisateur non connecté'));
        }

        const body = {
            oldPassword,
            newPassword,
            userId: currentUser.id
        };

        return this.post<any>('auth/resetPassword', body).pipe(
            tap(() => {
                console.log('Mot de passe réinitialisé avec succès');
                this.logout();
            }),
            catchError(this.handleError<any>('resetPassword'))
        );
    }

    /**
     * Récupérer le token JWT
     * @returns Le token JWT depuis le sessionStorage
     */
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    /**
     * Vérifier si l'utilisateur est connecté
     * @returns True si l'utilisateur est connecté
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    /**
     * Déconnexion de l'utilisateur
     */
    logout(): void {
        sessionStorage.clear();
        this.currentUserSubject.next(null);  // Réinitialiser l'utilisateur connecté
        console.log('Utilisateur déconnecté');
    }

    /**
     * Obtenir l'utilisateur connecté actuel
     * @returns Utilisateur ou null
     */
    getCurrentUser(): Utilisateur | null {
        return this.currentUserSubject.value;
    }
}

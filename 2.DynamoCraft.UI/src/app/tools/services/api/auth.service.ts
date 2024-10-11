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
    currentUserSubject: BehaviorSubject<Utilisateur | null>;

    constructor(protected override httpClient: HttpClient, private utilisateurService: UtilisateurService) {
        super(httpClient);
        this.currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
    }


    /**
     * Décoder le token JWT pour obtenir l'ID de l'utilisateur
     * @param token JWT
     * @returns L'ID de l'utilisateur extrait du token, ou null s'il n'est pas valide
     */
    decodeTokenToGetUserId(token: string): number | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Vérifie si le code est exécuté dans un environnement de navigateur
     */
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    /**
     * Obtenir l'utilisateur actuel en tant qu'Observable
     * @returns Observable de l'utilisateur connecté
     */
    get currentUser$(): Observable<Utilisateur | null> {
        return this.currentUserSubject.asObservable();
    }

    /**
     * Connexion de l'utilisateur sans reCAPTCHA
     * @param email Email de l'utilisateur
     * @param password Mot de passe de l'utilisateur
     * @returns Observable contenant l'access token
     */
    login(email: string, password: string): Observable<{ accessToken: string, id: string, roleId: string }> {
        const loginData = { email, password };
        return this.post<{ accessToken: string, id: string, roleId: string }>('auth/login', loginData).pipe(
            tap(response => {
                if (this.isBrowser()) {
                    localStorage.setItem(this.tokenKey, response.accessToken);
                }
                this.utilisateurService.getUtilisateurById(parseInt(response.id)).subscribe({
                    next: (datas) => {
                        datas.roleId = parseInt(response.roleId);
                        this.currentUserSubject.next(datas);
                    }
                });
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
     * Activation du compte utilisateur via le lien envoyé par email
     * @param token Token d'activation envoyé par email
     * @returns Observable indiquant le succès ou l'échec de l'activation
     */
    activateAccount(token: string): Observable<any> {
        return this.get<any>(`auth/activate/${token}`).pipe(
            tap(() => {
                console.log('Compte activé avec succès');
            }),
            catchError(this.handleError<any>('activateAccount'))
        );
    }

    /**
     * Renvoyer le lien d'activation
     * @param email Email de l'utilisateur
     * @returns Observable indiquant le succès ou l'échec de l'opération
     */
    resendActivationLink(email: string): Observable<any> {
        return this.post<any>('auth/resend-activation', { email }).pipe(
            tap(() => {
                console.log('Lien d\'activation renvoyé avec succès.');
            }),
            catchError(this.handleError<any>('resendActivationLink'))
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
     * Réinitialisation du mot de passe via le lien envoyé par email
     * @param token Token de réinitialisation envoyé par email
     * @param newPassword Nouveau mot de passe
     * @returns Observable indiquant le succès ou l'échec de l'opération
     */
    resetPasswordWithToken(token: string, newPassword: string): Observable<any> {
        const body = { token, newPassword };

        return this.post<any>('auth/reset-mot-de-passe-oublie', body).pipe(
            tap(() => {
                console.log('Mot de passe réinitialisé avec succès via le token');
            }),
            catchError(this.handleError<any>('resetPasswordWithToken'))
        );
    }

    /**
     * Demande de réinitialisation de mot de passe pour un utilisateur qui a oublié son mot de passe
     * @param email Email de l'utilisateur
     * @param recaptchaToken Token de validation reCAPTCHA
     * @returns Observable indiquant le succès ou l'échec de l'opération
     */
    forgotPassword(email: string, recaptchaToken: string): Observable<any> {
        const body = { email, recaptchaToken };
        return this.post<any>('auth/mot-de-passe-oublie', body).pipe(
            tap(() => {
                console.log('Email de réinitialisation du mot de passe envoyé');
            }),
            catchError(this.handleError<any>('forgotPassword'))
        );
    }

    /**
     * Récupérer le token JWT
     * @returns Le token JWT depuis le localStorage
     */
    getToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
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
        if (this.isBrowser()) {
            localStorage.clear();
            window.location.reload();
        }
    }

    /**
     * Obtenir l'utilisateur connecté actuel
     * @returns Utilisateur ou null
     */
    getCurrentUser(): Utilisateur | null {
        return this.currentUserSubject.value;
    }
}

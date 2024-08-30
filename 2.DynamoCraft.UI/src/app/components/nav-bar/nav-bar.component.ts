import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../tools/services/api/auth.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { environment } from '../../../environments/environment.dev';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
    currentUser: Utilisateur | null = null;
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        // S'abonner au BehaviorSubject pour détecter les changements d'état de l'utilisateur
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    // Vérifiez si l'utilisateur est connecté
    isConnected(): boolean {
        return !!this.currentUser;
    }

    // Vérifiez si l'utilisateur est un admin
    isAdmin(): boolean {
        return this.currentUser?.roleId === 3;
    }

    // Vérifiez si l'utilisateur est un modérateur
    isModerator(): boolean {
        return this.currentUser?.roleId === 2;
    }

    // Déconnecter l'utilisateur
    logout(): void {
        this.authService.logout();
    }

    // Récupère l'image de profil si l'utilisateur est connecté, sinon retourne null
    getProfileImage(): string | null {
        if (this.currentUser && this.currentUser.imageUtilisateur && this.currentUser.imageUtilisateur.nom) {
            return `${this.url}${this.currentUser.imageUtilisateur.nom}`; // Chemin vers le dossier des uploads
        }
        return null; // Retourne null si personne n'est connecté
    }
}

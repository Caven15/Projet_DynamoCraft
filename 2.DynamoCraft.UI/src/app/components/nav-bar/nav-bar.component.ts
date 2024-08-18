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

    logout(): void {
        this.authService.logout();
    }

    isConnected(): boolean {
        return !!this.currentUser; // Vérifiez si l'utilisateur est connecté
    }

    // Récupère l'image de profil si l'utilisateur est connecté, sinon retourne l'image par défaut
    getProfileImage(): string {
        if (this.currentUser && this.currentUser.ImageUtilisateur && this.currentUser.ImageUtilisateur.nom) {
            return `${this.url}${this.currentUser.ImageUtilisateur.nom}`; // Chemin vers le dossier des uploads
        }
        return 'assets/png/logo.png'; // Image par défaut depuis le dossier assets
    }
}

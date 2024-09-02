import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../tools/services/api/auth.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { environment } from '../../../environments/environment.dev';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
    currentUser: Utilisateur | null = null;
    userLinks: { label: string, url: string }[] = [];
    url: string = `${environment.apiUrl}/uploads/`;
    activeLink: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        // S'abonner pour détecter les changements d'état de l'utilisateur
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.updateUserLinks(); // Met à jour les liens du menu en fonction du rôle
        });

        // Initialiser l'état actif en fonction de l'URL actuelle
        this.activeLink = this.router.url || '/home';

        // S'abonner aux événements de navigation pour mettre à jour l'état actif
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.activeLink = event.urlAfterRedirects;
            }
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

    // Met à jour les liens du menu en fonction du rôle de l'utilisateur
    updateUserLinks(): void {
        this.userLinks = [
            { label: 'Mon Profil', url: '/utilisateur/profil' },
            { label: 'Ajouter projet', url: '/projet/ajout' }
        ];

        if (this.isModerator()) {
            this.userLinks.push({ label: 'Modérateur', url: '/moderator/dashboard' });
            this.userLinks.push({ label: 'Validation Projets', url: '/admin/detail-validation' });
        }

        if (this.isAdmin()) {
            this.userLinks.push({ label: 'Admin Panel', url: '/admin/panel' });
        }
    }

    // Définit le lien actif
    setActiveLink(link: string): void {
        this.activeLink = link;
    }

    // Vérifie si le lien est actif
    isActive(link: string): boolean {
        return this.activeLink === link;
    }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';

@Component({
    selector: 'app-validation-compte',
    templateUrl: './validation-compte.component.html',
    styleUrl: './validation-compte.component.scss'
})
export class ValidationCompteComponent {
    token: string | null = null;
    message: string = '';
    messageTitle: string = '';
    activationSuccess: boolean = false;

    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        if (this.token) {
            this.authService.activateAccount(this.token).subscribe({
                next: () => {
                    this.messageTitle = 'Activation réussie !';
                    this.message = 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.';
                    this.activationSuccess = true;
                },
                error: (err) => {
                    this.messageTitle = 'Erreur d\'activation';
                    this.message = 'Le lien d\'activation est invalide ou expiré. Veuillez réessayer ou contacter le support.';
                    this.activationSuccess = false;
                    console.error(err);
                }
            });
        }
    }

    navigateToLogin(): void {
        this.router.navigate(['auth/login']);
    }
}

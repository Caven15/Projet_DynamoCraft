import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-acces-non-autoriser',
    templateUrl: './acces-non-autoriser.component.html',
    styleUrls: ['./acces-non-autoriser.component.scss']
})
export class AccesNonAutoriserComponent implements AfterViewInit {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            const closeButton = document.getElementById('closeModalButton') as HTMLButtonElement;
            const dismissButton = document.getElementById('dismissButton') as HTMLButtonElement;
            const modalElement = document.getElementById('curiosityModal') as HTMLElement;
            const continueButton = document.getElementById('continueButton') as HTMLButtonElement;
            const videoIframe = document.getElementById('videoIframe') as HTMLIFrameElement;
            const countdownElement = document.getElementById('countdown') as HTMLElement;

            let countdown = 25;

            if (continueButton) {
                continueButton.addEventListener('click', () => {
                    // Définir la source de la vidéo avec la boucle/replay automatique
                    const videoId = "KTG5genOiNs";
                    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}`;
                });
            }

            if (closeButton && dismissButton && countdownElement) {
                // Désactive les boutons de fermeture
                closeButton.disabled = true;
                dismissButton.disabled = true;

                // Déclenche le décompte
                const countdownInterval = setInterval(() => {
                    countdown--;
                    countdownElement.textContent = `Temps restant avant de pouvoir fermer : ${countdown}s`;

                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        closeButton.disabled = false;
                        dismissButton.disabled = false;
                        countdownElement.textContent = "Vous pouvez maintenant fermer la modal.";
                    }
                }, 1000);

                // Ajoute un écouteur d'événements pour la fermeture de la modale
                modalElement.addEventListener('hidden.bs.modal', () => {
                    videoIframe.src = '';
                });
            }
        }
    }
}

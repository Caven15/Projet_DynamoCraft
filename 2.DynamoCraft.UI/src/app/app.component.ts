import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'DynamoCraft';

    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
                window.scrollTo(0, 0); // Recentre la page en haut à chaque redirection
            }
        });
    }
}

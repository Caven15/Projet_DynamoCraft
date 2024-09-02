import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../tools/services/api/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
    }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-google-captcha',
    templateUrl: './google-captcha.component.html',
    styleUrl: './google-captcha.component.scss'
})
export class GoogleCaptchaComponent {
    @Output() captchaResolved = new EventEmitter<string | null>();

    onCaptchaResolved(captchaResponse: string | null): void {
        this.captchaResolved.emit(captchaResponse);
    }
}

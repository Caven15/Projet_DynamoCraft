// email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Email } from '../../../models/email.model';

@Injectable({
    providedIn: 'root'
})
export class EmailService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Envoie un email au backend
     * @param email Les données de l'email
     * @returns Un Observable avec le résultat de l'opération
     */
    sendEmail(email: Email): Observable<any> {
        return this.post<any>('contact', email);
    }
}

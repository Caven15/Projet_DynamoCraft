import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../tools/services/api/email.service';
import { Email } from '../../models/email.model';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    captchaValid: boolean = false;
    captchaResponse: string = '';
    contactForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private emailService: EmailService
    ) { }

    ngOnInit(): void {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    onCaptchaResolved(captchaResponse: string | null): void {
        this.captchaResponse = captchaResponse || '';
        this.captchaValid = !!captchaResponse;
    }

    onSubmit(recaptchaRef: any): void { 
        if (this.contactForm.invalid || !this.captchaValid) {
            return;
        }

        const contactData = this.contactForm.value;
        const email = new Email(contactData.email, contactData.subject, contactData.message);

        this.emailService.sendEmail({ ...email, recaptchaToken: this.captchaResponse }).subscribe({
            next: () => {
                alert('Votre message a été envoyé avec succès !');
                this.contactForm.reset();
                this.captchaValid = false;
                recaptchaRef.reset();
            },
            error: (error) => {
                console.error('Erreur lors de l\'envoi de l\'email :', error);
                alert('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
                recaptchaRef.reset();
            }
        });
    }

    onReset(recaptchaRef: any): void {
        this.contactForm.reset();
        this.captchaValid = false;
        recaptchaRef.reset();
    }
}

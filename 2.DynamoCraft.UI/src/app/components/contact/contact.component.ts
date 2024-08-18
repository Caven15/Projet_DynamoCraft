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
    contactForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private emailService: EmailService
    ) { }

    ngOnInit(): void {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required], // Ajout du champ subject
            message: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.contactForm.invalid) {
            return;
        }

        const contactData = this.contactForm.value;
        const email = new Email(contactData.email, contactData.subject, contactData.message);

        this.emailService.sendEmail(email).subscribe({
            next: () => {
                alert('Votre message a été envoyé avec succès !');
                this.contactForm.reset();
            },
            error: (error) => {
                console.error('Erreur lors de l\'envoi de l\'email :', error);
                alert('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
            }
        });
    }

    onReset(): void {
        this.contactForm.reset();
    }
}

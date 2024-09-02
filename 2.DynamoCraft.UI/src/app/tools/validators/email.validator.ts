import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function email(minLength: number = 2): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const email = control.value as string;
        if (email) {
            const parts = email.split('.');
            const domainPart = parts[parts.length - 1]; // Récupère la partie après le dernier point
            if (domainPart.length < minLength) {
                return { invalidDomainLength: true };
            }
        }
        return null;
    };
}
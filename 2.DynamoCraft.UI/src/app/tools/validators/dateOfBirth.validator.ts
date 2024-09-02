import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateOfBirth(minAge: number = 18, maxAge: number = 120) {
    return (control: AbstractControl): ValidationErrors | null => {
        const today = new Date();
        const birthDate = new Date(control.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < minAge || age > maxAge) {
            return { invalidDate: true };
        }
        return null;
    };
}
import { AbstractControl, ValidationErrors } from '@angular/forms';


export function password() {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumeric = /[0-9]/.test(value);
        const hasSpecial = /[!@#\$%\^\&*\)\(+=._-]/.test(value);
        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
        return !valid ? { passwordComplexity: true } : null;
    };
}
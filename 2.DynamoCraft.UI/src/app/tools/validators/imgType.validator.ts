import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imgType(allowedTypes: string[] = ['png', 'jpeg', 'jpg', 'gif']) {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!allowedTypes.includes(fileExtension || '')) {
                return { imgTypeNotAllowed: true };
            }
        }
        return null;
    };
}
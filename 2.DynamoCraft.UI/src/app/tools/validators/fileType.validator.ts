import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fileType() {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension !== 'stl') {
                return { FileTypeNotAllowed: true };
            }
        }
        return null;
    };
}
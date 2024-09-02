import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fileSize(maxSizeMB: number = 50) {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file && file.size / 1024 / 1024 > maxSizeMB) {
            return { fileSizeExceeded: true };
        }
        return null;
    };
}
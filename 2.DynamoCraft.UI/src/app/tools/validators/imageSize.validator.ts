import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageSize(maxSizeMB: number = 5) {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;
        if (file && file.size / 1024 / 1024 > maxSizeMB) {
            return { fileSizeExceeded: true };
        }
        return null;
    };
}
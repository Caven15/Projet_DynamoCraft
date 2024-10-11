// Validator pour la taille de l'image
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageSize(maxSizeMB: number): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value;
        if (file && file instanceof File) {
            const sizeInMB = file.size / (1024 * 1024); // Convertir en MB
            if (sizeInMB > maxSizeMB) {
                console.log("image trop grande !!!");
                return { fileSizeExceeded: true }; // Erreur si dépassement de taille
            }
        }
        return null;
    };
}

import { AbstractControl, ValidationErrors } from "@angular/forms";

export function file3DSize(maxSizeMB: number = 50) {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value;
        if (file && file instanceof File) {
            if (file.size / 1024 / 1024 > maxSizeMB) {
                return { fileSizeExceeded: true };
            }
        }
        return null;
    };
}

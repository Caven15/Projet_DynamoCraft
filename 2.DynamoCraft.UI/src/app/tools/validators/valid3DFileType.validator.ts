import { AbstractControl, ValidationErrors } from '@angular/forms';

export function valid3DFileType(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value;
        if (file && file instanceof File) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension !== 'stl') {
                return { invalidFileType: true };
            }
        }
        return null;
    };
}

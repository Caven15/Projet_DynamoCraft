import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export function validImageType(): (control: AbstractControl) => Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const allowedSignatures = {
        'image/png': '89504e47',
        'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
        'image/gif': '47494638',
    };

    return (control: AbstractControl): Promise<ValidationErrors | null> => {
        const file: File = control.value;
        return new Promise((resolve) => {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = (e) => {
                    if (e.target?.result) {
                        const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
                        let header = '';
                        for (let i = 0; i < arr.length; i++) {
                            header += arr[i].toString(16).toLowerCase();
                        }

                        let isValidType = false;
                        if (header === allowedSignatures['image/png']) {
                            isValidType = true;
                        } else if (allowedSignatures['image/jpeg'].includes(header)) {
                            isValidType = true;
                        } else if (header === allowedSignatures['image/gif']) {
                            isValidType = true;
                        }

                        if (!isValidType) {
                            resolve({ invalidImageType: true });
                        } else {
                            resolve(null);
                        }
                    } else {
                        resolve({ invalidImageType: true });
                    }
                };

                reader.onerror = () => resolve({ invalidImageType: true });
                reader.readAsArrayBuffer(file);
            } else {
                resolve(null);
            }
        });
    };
}

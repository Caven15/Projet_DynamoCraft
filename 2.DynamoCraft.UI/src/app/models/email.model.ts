export class Email {
    constructor(
        public email: string,
        public subject: string,
        public message: string,
        public recaptchaToken?: string
    ) {}
}
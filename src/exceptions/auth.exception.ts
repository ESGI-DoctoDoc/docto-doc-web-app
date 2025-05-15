import {AppException} from "~/exceptions/app.exception";

export class AuthException extends AppException {
    constructor(message: string) {
        super(message);
        this.name = "AuthException";
    }
}

export class AuthMapperException extends AuthException {
    constructor() {
        super('Auth mapping error');
        this.name = "AuthMapperException";
    }
}
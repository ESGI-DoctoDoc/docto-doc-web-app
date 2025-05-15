import {AppException} from "~/exceptions/app.exception";

export class UserException extends AppException {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
    }
}

export class UserMapperException extends UserException {
    constructor() {
        super('User mapping error');
        this.name = "UserMapperException";
    }
}
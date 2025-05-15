import {AppException} from "~/exceptions/app.exception";

export class DoctorException extends AppException {
    constructor(message: string) {
        super(message);
        this.name = "DoctorException";
    }
}

export class DoctorNotFoundException extends DoctorException {
    constructor(message: string) {
        super(message);
        this.name = "DoctorNotFoundException";
    }
}
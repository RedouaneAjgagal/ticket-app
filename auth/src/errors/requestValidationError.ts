import { ValidationError } from "express-validator";

export default class RequestValidationError extends Error {
    statusCode: number;
    constructor(public errors: ValidationError[]) {
        super();
        this.statusCode = 400;

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
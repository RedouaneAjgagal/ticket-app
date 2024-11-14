import { CustomError } from "./custom-error";

export default class UnauthorizedError extends CustomError {
    statusCode = 403;
    constructor() {
        super("Unauthorized action");

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    serializeErrors() {
        return [{
            message: "Not authorized"
        }];
    };
};
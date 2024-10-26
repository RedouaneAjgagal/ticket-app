import { CustomError } from "./custom-error";

export default class UnauthenticatedError extends CustomError {
    statusCode = 401;
    constructor() {
        super("Unauthenticated action");

        Object.setPrototypeOf(this, UnauthenticatedError.prototype);
    }

    serializeErrors() {
        return [{
            message: "Not authenticated"
        }];
    };
};
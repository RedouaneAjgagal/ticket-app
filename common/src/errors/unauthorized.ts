import { CustomError } from "./custom-error";

export default class Unauthorized extends CustomError {
    statusCode = 403;
    constructor() {
        super("Unauthorized action");
    }

    serializeErrors() {
        return [{
            message: "Not authorized"
        }];
    };
};
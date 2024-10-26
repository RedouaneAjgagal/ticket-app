import { CustomError } from "./custom-error";

type ValidationErrorWithField = {
    type: "field";
    msg: string;
    path: string;
}

type ValidationError = {
    type: "alternative" | "alternative_grouped" | "unknown_fields";
    msg: string;
} | ValidationErrorWithField;

export default class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => {
            if (error.type === "field") {
                return {
                    message: error.msg,
                    field: error.path
                }
            }

            return {
                message: error.msg
            }
        });
    }
}
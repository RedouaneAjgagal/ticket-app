import { ErrorRequestHandler } from "express";
import RequestValidationError from "../errors/requestValidationError";

interface IErrorContent {
    message: string;
    field?: string;
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let errors: IErrorContent[] = [];

    if (err instanceof RequestValidationError) {
        errors = err.errors.map(error => {
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
    } else {
        errors = [{
            message: "Something went wrong"
        }];
    }

    res.status(err.statusCode || 500).json({
        errors
    });
    return;
};

export default errorHandler;
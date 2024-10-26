import { ErrorRequestHandler } from "express";
import { CustomError } from "../errors/custom-error";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            errors: err.serializeErrors()
        });
        return;
    }

    res.status(500).json({
        errors: [{
            message: "Something went wrong"
        }]
    });
    return;
};

export default errorHandler;
import { ErrorRequestHandler } from "express";
import { CustomError } from "../errors/custom-error";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            errors: err.serializeErrors()
        });
        return;
    }

    if (err && err.code === 1100) {
        res.status(400).json({
            errors: [{
                message: "Duplicated value entered, please choose another value"
            }]
        });
        return;
    }

    if (err && err.name === "CastError") {
        res.status(404).json({
            errors: [{
                message: err.value ? `No item found with ID ${err.value}` : "No item found"
            }]
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
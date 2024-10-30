import { ErrorRequestHandler } from "express";
import { CustomError } from "../errors/custom-error";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            errors: err.serializeErrors()
        });
        return;
    }

    if (err && err.code === 11000) {
        res.status(400).json({
            errors: [{
                message: `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
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

    console.error(err);

    res.status(500).json({
        errors: [{
            message: "Something went wrong"
        }]
    });
    return;
};

export default errorHandler;
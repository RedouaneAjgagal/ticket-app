import { RequestHandler } from "express";
import { UnauthenticatedError } from "../errors";

const authentication: RequestHandler = (req, res, next) => {
    if (!req.user) {
        throw new UnauthenticatedError();
    }

    next();
};

export default authentication;
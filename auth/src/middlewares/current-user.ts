import { RequestHandler } from "express";
import { Jwt } from "../services";
import { IUserPayload } from "../helpers";

interface IUserPayloadToken extends IUserPayload {
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user: IUserPayloadToken | null
        }
    }
}

const currentUser: RequestHandler = (req, res, next) => {
    const accessToken = req.signedCookies?.access_token;
    if (!accessToken) {
        req.user = null;
        return next();
    };

    try {
        const userPayload = Jwt.verify(accessToken) as IUserPayloadToken;
        req.user = userPayload;
    } catch (error) {
        req.user = null;
    };

    next();
};

export default currentUser;
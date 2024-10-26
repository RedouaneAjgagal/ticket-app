import { NextFunction, Request, RequestHandler, Response } from "express";
import { Jwt } from "../services";

interface IUserPayload {
    id: string;
    email: string;
}

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

const currentUser = (jwtSecret: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.signedCookies?.access_token;
        if (!accessToken) {
            req.user = null;
            return next();
        };

        try {
            const userPayload = Jwt.verify(accessToken, jwtSecret) as IUserPayloadToken;
            req.user = userPayload;
        } catch (error) {
            req.user = null;
        };

        next();
    }
};

export type {
    IUserPayload,
    IUserPayloadToken
}

export default currentUser;
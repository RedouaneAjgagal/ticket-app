import { Response } from "express";

interface ICreateCookie {
    cookieName: string;
    token: string;
    expiresInMs: number;
    res: Response;
}

interface IDestroyCookie {
    cookieName: string;
    res: Response;
}
export default class Cookie {
    static create({ cookieName, expiresInMs, res, token }: ICreateCookie) {
        res.cookie(
            cookieName,
            token,
            {
                signed: true,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now() + expiresInMs)
            }
        )
    }

    static destroy({ cookieName, res }: IDestroyCookie) {
        res.cookie(cookieName, null, {
            httpOnly: true,
            expires: new Date(Date.now())
        });
    }
}
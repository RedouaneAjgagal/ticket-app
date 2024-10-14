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
    static create(cookie: ICreateCookie) {
        cookie.res.cookie(
            cookie.cookieName,
            cookie.token,
            {
                signed: true,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now() + cookie.expiresInMs)
            }
        )
    }

    static destroy(cookie: IDestroyCookie) {
        cookie.res.cookie(cookie.cookieName, null, {
            httpOnly: true,
            expires: new Date(Date.now())
        });
    }
}
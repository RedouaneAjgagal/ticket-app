import { Response } from "express";

interface ICreateCookie {
    cookieName: string;
    token: string;
    expiresInMs: number;
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
}
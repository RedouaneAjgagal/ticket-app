import { Response } from "express";
import { Cookie, Jwt } from "@redagtickets/common";

interface IUserPayload {
    id: string;
    email: string;
}

export const AUTHENTICATION_TOKEN_NAME = "access_token";

const setAccessToken = ({ userPayload, res }: { userPayload: IUserPayload; res: Response }) => {
    const expiresInMs = 15 * 60 * 1000; // 15min

    const token = Jwt.create({
        payload: userPayload,
        expiresInMs,
        jwtSecret: process.env.JWT_SECRET!
    });

    Cookie.create({
        cookieName: AUTHENTICATION_TOKEN_NAME,
        expiresInMs,
        token,
        res
    });
};

const removeAccessToken = (res: Response) => {
    Cookie.destroy({
        cookieName: AUTHENTICATION_TOKEN_NAME,
        res
    });
}

const accessTokenManager = {
    setAccessToken,
    removeAccessToken
}

export type {
    IUserPayload
}

export default accessTokenManager;
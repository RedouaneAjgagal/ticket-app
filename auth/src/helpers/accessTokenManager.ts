import { Response } from "express";
import { Cookie, Jwt } from "../services";

interface IUserPayload {
    id: string;
    email: string;
}

const setAccessToken = ({ userPayload, res }: { userPayload: IUserPayload; res: Response }) => {
    const expiresInMs = 15 * 60 * 1000; // 15min

    const token = Jwt.create({
        payload: userPayload,
        expiresInMs
    });

    Cookie.create({
        cookieName: "access_token",
        expiresInMs,
        token,
        res
    });
};

const accessTokenManager = {
    setAccessToken
}

export default accessTokenManager;
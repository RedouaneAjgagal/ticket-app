import jwt from "jsonwebtoken";

interface IJwtCreate {
    jwtSecret: string;
    payload: Object;
    expiresInMs: number;
}

export default class Jwt {
    static create({ payload, expiresInMs, jwtSecret }: IJwtCreate) {
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: expiresInMs / 1000
        });

        return token;
    }

    static verify(token: string, jwtSecret: string) {
        const payload = jwt.verify(token, jwtSecret);
        return payload;
    }
}
import jwt from "jsonwebtoken";

interface IJwtCreate {
    payload: Object;
    expiresInMs: number;
}

export default class Jwt {
    static create({ payload, expiresInMs }: IJwtCreate) {
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: expiresInMs / 1000
        });

        return token;
    }
}
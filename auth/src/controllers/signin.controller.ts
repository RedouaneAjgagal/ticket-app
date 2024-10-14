//@ts-check
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../models/user";
import { PasswordManager } from "../services";
import { accessTokenManager } from "../helpers";

/**
 * signin controller
 * @param req
 * @param res
 */
const signinController: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    };

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError("Invalid credentials");
    };

    const isCorrectPassword = await PasswordManager.compare(password, user.password);
    if (!isCorrectPassword) {
        throw new BadRequestError("Invalid credentials");
    }

    accessTokenManager.setAccessToken({
        res,
        userPayload: {
            id: user.id,
            email: user.email
        }
    });

    res.status(200).json(user);
}

export default signinController;
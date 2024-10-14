//@ts-check
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../models/user";
import { accessTokenManager } from "../helpers";

/**
 * signup a user controller
 * @param req
 * @param res
 */
const signupController: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new BadRequestError("This email is already in use");

    const user = User.build({
        email,
        password
    });

    await user.save();

    const userPayload = {
        id: user.id,
        email: user.email
    };

    accessTokenManager.setAccessToken({
        userPayload,
        res
    });

    res.status(201).json(user);
}

export default signupController;
//@ts-check
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../models/user";
import { Cookie, Jwt } from "../services";

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
        _id: user._id,
        email: user.email
    };

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

    console.log(user);
    

    res.status(201).json(user);
}

export default signupController;
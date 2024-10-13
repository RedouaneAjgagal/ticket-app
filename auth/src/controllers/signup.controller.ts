//@ts-check
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";
import { User } from "../models/user";

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

    res.status(201).json({
        _id: user._id,
        email: user.email
    });
}

export default signupController;
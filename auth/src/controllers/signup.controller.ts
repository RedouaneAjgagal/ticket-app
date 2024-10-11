//@ts-check
import { RequestHandler } from "express";

/**
 * signup a user controller
 * @param req
 * @param res
 */
const signupController: RequestHandler = (req, res) => {
    res.status(200).json({ status: "Signup" });
}

export default signupController;
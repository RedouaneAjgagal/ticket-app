//@ts-check
import { RequestHandler } from "express";

/**
 * signin controller
 * @param req
 * @param res
 */
const signinController: RequestHandler = (req, res) => {
    res.status(200).json({ status: "Signin" });
}

export default signinController;
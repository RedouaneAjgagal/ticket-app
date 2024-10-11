//@ts-check
import { RequestHandler } from "express";

/**
 * signout controller
 * @param req
 * @param res
 */
const signoutController: RequestHandler = (req, res) => {
    res.status(200).json({ status: "Signout" });
}

export default signoutController;
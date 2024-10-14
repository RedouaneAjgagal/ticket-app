//@ts-check
import { RequestHandler } from "express";
import { accessTokenManager } from "../helpers";

/**
 * signout controller
 * @param req
 * @param res
 */
const signoutController: RequestHandler = (req, res) => {
    accessTokenManager.removeAccessToken(res);
    res.status(200).json({});
}

export default signoutController;
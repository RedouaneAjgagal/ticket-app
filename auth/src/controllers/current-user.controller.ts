//@ts-check
import { RequestHandler } from "express";

/**
 * Get current user information
 * @param req
 * @param res
 */
const currentUserController: RequestHandler = (req, res) => {
    res.status(200).json({
        user: req.user
    });
}

export default currentUserController;
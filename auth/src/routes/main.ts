import { currentUserController, signinController, signoutController, signupController } from "../controllers";
import { createUserValidation } from "../validators";
import { Router } from "express";
import signupUserValidation from "../validators/signup-user-validator";

const router = Router();

router.get("/api/users/current-user", currentUserController);
router.post("/api/users/signup", createUserValidation(), signupController);
router.post("/api/users/signin", signupUserValidation(), signinController);
router.post("/api/users/signout", signoutController);

export default router
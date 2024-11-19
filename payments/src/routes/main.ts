import { Router } from "express";
import { newPaymentController } from "../controllers";
import { authentication } from "@redagtickets/common";
import { newPaymentValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...newPaymentValidator(), newPaymentController);

export default router;
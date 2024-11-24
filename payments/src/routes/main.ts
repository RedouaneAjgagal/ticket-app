import { Router } from "express";
import { createPaymentIntentController, newPaymentController } from "../controllers";
import { authentication } from "@redagtickets/common";
import { createPaymentIntentValidator, newPaymentValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...newPaymentValidator(), newPaymentController);
router.post("/create-payment-intent", authentication, ...createPaymentIntentValidator(), createPaymentIntentController);

export default router;
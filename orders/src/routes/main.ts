import { authentication } from "@redagtickets/common";
import { Router } from "express";
import { createOrderController, cancelOrderController, getOrdersController, getSingleOrderController } from "../controllers";
import { cancelOrderValidator, createTicketValidator, getSIngleOrderValidator } from "../validators";

const router = Router();

router.get("/", authentication, getOrdersController);
router.post("/", authentication, ...createTicketValidator(), createOrderController);
router.get("/:orderId", authentication, ...getSIngleOrderValidator(), getSingleOrderController);
router.patch("/:orderId", authentication, ...cancelOrderValidator(), cancelOrderController);

export default router;
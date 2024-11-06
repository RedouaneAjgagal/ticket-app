import { authentication } from "@redagtickets/common";
import { Router } from "express";
import { createOrderController, deleteOrderController, getOrdersController, getSingleOrderController } from "../controllers";
import { createTicketValidator } from "../validators";

const router = Router();

router.get("/", authentication, getOrdersController);
router.post("/", authentication, ...createTicketValidator(), createOrderController);
router.get("/:orderId", authentication, getSingleOrderController);
router.delete("/:orderId", authentication, deleteOrderController);

export default router;
import { authentication } from "@redagtickets/common";
import { Router } from "express";
import { createOrderController, deleteOrderController, getOrdersController, getSingleOrderController } from "../controllers";

const router = Router();

router.get("/", authentication, getOrdersController);
router.post("/", authentication, createOrderController);
router.get("/:orderId", authentication, getSingleOrderController);
router.delete("/:orderId", authentication, deleteOrderController);

export default router;
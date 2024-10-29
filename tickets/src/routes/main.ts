import { authentication } from "@redagtickets/common";
import { createTicketController } from "../controllers";
import { Router } from "express";

const router = Router();

router.post("/", authentication, createTicketController);

export default router;
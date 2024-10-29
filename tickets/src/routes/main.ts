import { authentication } from "@redagtickets/common";
import { createTicketController } from "../controllers";
import { Router } from "express";
import { createTicketValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...createTicketValidator(), createTicketController);

export default router;
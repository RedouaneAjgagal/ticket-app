import { authentication } from "@redagtickets/common";
import { createTicketController, getSingleTicketController } from "../controllers";
import { Router } from "express";
import { createTicketValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...createTicketValidator(), createTicketController);
router.get("/:ticketId", getSingleTicketController);

export default router;
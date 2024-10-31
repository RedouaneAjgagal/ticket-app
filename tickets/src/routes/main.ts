import { authentication } from "@redagtickets/common";
import { createTicketController, getSingleTicketController, getTicketsController } from "../controllers";
import { Router } from "express";
import { createTicketValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...createTicketValidator(), createTicketController);
router.get("/", getTicketsController);
router.get("/:ticketId", getSingleTicketController);

export default router;
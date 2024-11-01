import { authentication } from "@redagtickets/common";
import { createTicketController, getSingleTicketController, getTicketsController, updateTicketController } from "../controllers";
import { Router } from "express";
import { createTicketValidator, updateTicketValidator } from "../validators";

const router = Router();

router.post("/", authentication, ...createTicketValidator(), createTicketController);
router.get("/", getTicketsController);
router.get("/:ticketId", getSingleTicketController);
router.put("/:ticketId", authentication, ...updateTicketValidator(), updateTicketController);

export default router;
import { createTicketController } from "../controllers";
import { Router } from "express";

const router = Router();

router.post("/", createTicketController);

export default router;
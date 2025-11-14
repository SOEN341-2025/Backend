import TicketController from "../Controllers/ticketController.mjs";
import { Router } from "express"
import { authenticateToken } from '../middleware/auth.mjs';

const router = Router()

router.post("/", authenticateToken, TicketController.buyTicket)
router.get("/", authenticateToken, TicketController.getTickets)


export default router
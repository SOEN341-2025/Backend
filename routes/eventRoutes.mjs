import { Router } from "express"
import { requireAdmin  , authenticateToken } from "../middleware/auth.mjs"
import eventsController from "../Controllers/eventController.mjs"

const router = Router()

router.get("/events", eventsController.getAllEvents)
router.get("/events/:id", eventsController.getEventById)
router.delete("/events/:id", authenticateToken , eventsController.deleteEventById)  
router.post("/events", authenticateToken , eventsController.addEvent)

export default router
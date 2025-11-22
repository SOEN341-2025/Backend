import { Router } from "express"
import { requireAdmin  , authenticateToken } from "../middleware/auth.mjs"
import eventsController from "../Controllers/eventController.mjs"

const router = Router()

router.get("/", eventsController.getAllEvents)
router.post("/", authenticateToken , eventsController.addEvent)

router.get("/:id", eventsController.getEventById)

router.get("/analytics/:id", authenticateToken, eventsController.getEventAnalytics)

router.delete("/:id", authenticateToken , eventsController.deleteEventById)  

export default router
import { Router } from "express"
import eventsController from "../Controllers/eventController.mjs"  // Import the eventsController

const router = Router()

router.get("/events", eventsController.getAllEvents)
router.get("/events/:id", eventsController.getEventById)
router.delete("/events/:id", eventsController.deleteEventById)  
router.post("/events", eventsController.addEvent)

export default router   
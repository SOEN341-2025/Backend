import e, { Router } from "express"
import eventsController from "../Controllers/eventsController.mjs"  // Import the eventsController

const router = Router()

//router.get("/", eventsController.hello)
//router.post("/post", eventsController.postTest)
// router.post("/", eventsController.create)
//router.put("/:id", eventsController.updateTest)
//router.delete("/delete", eventsController.deleteTest)


router.get("/events", eventsController.getAllEvents)
router.get("/events/:id", eventsController.getEventById)
router.delete("/events/:id", eventsController.deleteEventById)  
router.post("/events", eventsController.addEvent)

export default router   
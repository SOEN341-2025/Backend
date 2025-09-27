import e, { Router } from "express"
import testController from "../Controllers/testController.mjs"

const router = Router()

router.get("/", testController.hello)
router.post("/post", testController.postTest)
// router.post("/", testController.create)
router.put("/:id", testController.updateTest)
router.delete("/delete", testController.deleteTest)


router.get("/events", testController.getEvents)
router.post("/events", testController.addEvent)

export default router
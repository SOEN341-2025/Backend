import UserController from '../Controllers/userController.mjs';
import { Router } from "express"


const router = Router()

router.post("/login", UserController.login)

export default router
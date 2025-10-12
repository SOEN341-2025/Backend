import UserController from '../Controllers/userController.mjs';
import { Router } from "express"


const router = Router()

router.post('/register', userController.register)
router.post("/login", UserController.login)
router.post("/signUp", UserController.signUp)

export default router
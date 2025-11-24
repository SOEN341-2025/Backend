import UserController from '../Controllers/userController.mjs';
import { Router } from "express"

const router = Router()

router.post('/register', UserController.register)
router.post("/login", UserController.login)
router.post("/wishlist", UserController.addWishList)
router.get("/wishlist", UserController.getWishList)

export default router
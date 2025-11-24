import UserController from '../Controllers/userController.mjs';
import { Router } from "express"
import { authenticateToken } from '../middleware/auth.mjs';


const router = Router()

router.post('/register', UserController.register)
router.post("/login", UserController.login)
router.post("/wishlist", authenticateToken, UserController.addWishList)
router.get("/wishlist", authenticateToken, UserController.getWishList)

export default router
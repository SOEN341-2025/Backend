import UserController from '../Controllers/userController.mjs';
import { Router } from "express"
import { authenticateToken } from '../middleware/auth.mjs';


const router = Router()

router.post('/register', UserController.register)
router.post("/login", UserController.login)
router.get("/organizations", authenticateToken , UserController.getOrganizations)
router.get("/ticket", authenticateToken, UserController.getTickets)

export default router
import { Router } from "express"
import { authenticateToken, requireAdmin} from '../middleware/auth.mjs';
import adminController from "../Controllers/adminController.mjs";

const router = Router()

router.get("/", authenticateToken , requireAdmin, adminController.getAdminData)

export default router
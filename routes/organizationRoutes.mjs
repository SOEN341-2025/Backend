import OrganizationController from "../Controllers/organizationController.mjs";
import { Router } from "express"
import { authenticateToken } from '../middleware/auth.mjs';


const router = Router()
router.get("/", OrganizationController.getOrganization)
router.post("/analytics", OrganizationController.getOrgnaizationAnalytics)
router.get("/user", authenticateToken , OrganizationController.getUserOrganizations)


export default router
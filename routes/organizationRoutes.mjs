import OrganizationController from "../Controllers/organizationController.mjs";
import { Router } from "express"

const router = Router()
router.get("/", OrganizationController.getOrganization)
router.post("/analytics", OrganizationController.getOrgnaizationAnalytics)


export default router
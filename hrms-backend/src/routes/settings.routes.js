import express from "express";
import {
  getMyProfile,
  updateProfile,
  changePassword,
} from "../controllers/settings/account.controller.js";
import {
  getCompanySettings,
  updateCompanySettings,
} from "../controllers/settings/company.controller.js";
import {
  getAttendanceRules,
  updateAttendanceRules,
} from "../controllers/settings/attendanceRules.controller.js";
import { protect,hrAdminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * 👤 Account Settings
 */
router.get("/me", protect, getMyProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

/**
 * 🏢 Company Settings (HR Admin only)
 */
router.get("/company", protect, hrAdminOnly, getCompanySettings);
// router.post("/company", protect, hrAdminOnly, createCompany);
router.put("/company", protect, hrAdminOnly, updateCompanySettings);


router.get(
  "/attendance-rules",
  protect,
  hrAdminOnly,
  getAttendanceRules
);

router.put(
  "/attendance-rules",
  protect,
  hrAdminOnly,
  updateAttendanceRules
);



export default router;

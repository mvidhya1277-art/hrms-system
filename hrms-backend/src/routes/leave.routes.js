import express from "express";
import {
  applyLeave,
  myLeaves,
  allLeaves,
  updateLeaveStatus,
  applyLeaveByAdminSelf
} from "../controllers/leave.controller.js";

import {
  protect,
  hrAdminOnly,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/* EMPLOYEE */
router.post("/apply", protect, applyLeave);
router.get("/my", protect, myLeaves);

/* ADMIN */
router.get("/all", protect, hrAdminOnly, allLeaves);
router.put("/:id", protect, hrAdminOnly, updateLeaveStatus);

//admin leave

router.post("/admin/apply", protect, applyLeaveByAdminSelf);

export default router;
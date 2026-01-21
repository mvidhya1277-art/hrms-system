import express from "express";
import {
  getEmployeeDashboard,
  getAdminDashboard,
  getMonthlyAttendanceChart
} from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/employee", protect, getEmployeeDashboard);
router.get("/admin", protect, getAdminDashboard);
router.get("/monthly-chart",protect,getMonthlyAttendanceChart);

export default router;

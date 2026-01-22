import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import { getAttendanceReport } from "../controllers/reports/attendance.report.js";
import { getWorkingHoursReport } from "../controllers/reports/workingHours.report.js";
import { getLeaveReport } from "../controllers/reports/leave.report.js";
import { getPayrollReport } from "../controllers/reports/payroll.report.js";
import { getPerformanceReport } from "../controllers/reports/performance.report.js";





const router = express.Router();

router.get("/attendance", protect, getAttendanceReport);
router.get("/working-hours", protect, getWorkingHoursReport);
router.get("/leave", protect, getLeaveReport);
router.get("/payroll", protect, getPayrollReport);
router.get("/performance", protect, getPerformanceReport);






export default router;

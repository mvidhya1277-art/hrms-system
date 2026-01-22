import express from "express";
import {
  getTodayAttendance,
  getAttendanceByDate,
  getAttendanceByEmployee,
  getMyAttendance,
  attendanceLeaveReport,
} from "../controllers/attendance.controller.js";

import { protect ,hrAdminOnly} from "../middleware/auth.middleware.js";
import { companyScope } from "../middleware/CompanyScope.js";


const router = express.Router();

// Daily report (today)
router.get("/today", protect, companyScope, getTodayAttendance);

// Attendance by date
router.get("/date/:date", protect, companyScope, getAttendanceByDate);


// Attendance by employee
router.get("/employee/:empId",protect, companyScope, getAttendanceByEmployee);

//Employee view Attendance of their own

router.get("/my-attendance",protect, getMyAttendance);


router.get("/attendance-leave",protect, attendanceLeaveReport);
// router.get("/attendance-leave/admin-self",protect,hrAdminOnly,getAdminOwnCalendar);

router.get("/attendance-leave/:employeeId",protect,hrAdminOnly,attendanceLeaveReport);






export default router;

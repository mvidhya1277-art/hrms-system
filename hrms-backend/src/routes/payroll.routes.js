import express from "express";
import {
  generatePayroll,
  getAllPayrolls,
  getEmployeePayroll,
  getMyPayroll,
  recalculatePayroll,
  generateBulkPayroll,
  getAllPayrollsForCompany
} from "../controllers/payroll.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", protect, generatePayroll);
router.get("/all", protect, getAllPayrolls);
router.get("/employee", protect, getEmployeePayroll); 
router.get("/employee/:id", protect, getEmployeePayroll);
router.get("/me", protect, getMyPayroll);
router.patch("/recalculate/:payrollId", protect, recalculatePayroll);
router.post("/generate-bulk", protect, generateBulkPayroll);
router.get("/payroll/all", protect, getAllPayrollsForCompany);






export default router;

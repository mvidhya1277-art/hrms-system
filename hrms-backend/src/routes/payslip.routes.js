import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getPayslip,downloadPayslipPDF } from "../controllers/payslip.controller.js";

const router = express.Router();

// router.post("/generate/:payrollId", protect, getPayslip);
router.get("/:id/payslip", protect, getPayslip);

router.get("/:id/payslip/pdf", protect, downloadPayslipPDF);

export default router;

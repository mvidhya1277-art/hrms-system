import express from "express";
import { resetEmployeePassword,updateEmployeeSalary,getEmployeeListByFilter } from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ⚠️ TEMPORARY – remove after reset
router.post("/reset-password", resetEmployeePassword);
router.patch("/:employeeId/salary", protect, updateEmployeeSalary);
router.get("/list", protect, getEmployeeListByFilter);



export default router;
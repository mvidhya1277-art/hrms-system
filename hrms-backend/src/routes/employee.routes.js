import express from "express";
import { resetEmployeePassword,updateEmployeeSalary,getEmployeeListByFilter,deleteEmployee,restoreEmployee } from "../controllers/employee.controller.js";
import { protect,hrAdminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ⚠️ TEMPORARY – remove after reset
router.post("/reset-password", resetEmployeePassword);
router.patch("/:employeeId/salary", protect, updateEmployeeSalary);
router.get("/list", protect, getEmployeeListByFilter);
router.delete("/:id",protect,hrAdminOnly,deleteEmployee);
router.patch("/restore/:id",protect,hrAdminOnly,restoreEmployee);
router.get("/", protect, hrAdminOnly, getEmployeeListByFilter);


export default router;
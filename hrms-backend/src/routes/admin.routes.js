import express from "express";
import { companyScope } from "../middleware/CompanyScope.js";
import {
  registerDevice,
  addEmployee,
  getEmployees,
  createAdmin,
} from "../controllers/admin.controller.js";

import {
  protect,
  superAdminOnly,
  hrAdminOnly,
} from "../middleware/auth.middleware.js";



const router = express.Router();

// SUPER ADMIN
router.post("/create-admin", protect, superAdminOnly, createAdmin);
router.post("/device", protect, superAdminOnly, registerDevice);

// HR ADMIN + SUPER ADMIN
router.post("/employee", protect, hrAdminOnly, companyScope, addEmployee);
router.get("/employees", protect, hrAdminOnly, companyScope, getEmployees);

export default router;

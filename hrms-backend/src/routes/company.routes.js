import express from "express";
import { createCompany } from "../controllers/company.controller.js";
import { protect, superAdminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, superAdminOnly, createCompany);

export default router;
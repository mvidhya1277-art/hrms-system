import express from "express";
import {
  createHoliday,
  getAllHolidays,
  deleteHoliday,
  getCompanyHolidays,
  updateHoliday
} from "../controllers/holiday.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createHoliday);      // add holiday
router.get("/", protect, getAllHolidays);      // list holidays
router.delete("/:id", protect, deleteHoliday); // delete holiday
router.put("/:id", protect, updateHoliday);       // edit holiday
router.get("/public/list", protect, getCompanyHolidays); // employee view


export default router;

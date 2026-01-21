import express from "express";
import {
  createHoliday,
  getAllHolidays,
  deleteHoliday,
} from "../controllers/holiday.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createHoliday);      // add holiday
router.get("/", protect, getAllHolidays);      // list holidays
router.delete("/:id", protect, deleteHoliday); // delete holiday

export default router;

import express from "express";
import { handleRfidScan,assignRfid } from "../controllers/rfid.controller.js";
import {
  protect,
  hrAdminOnly,
} from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/scan", handleRfidScan);
router.put("/assign-rfid/:employeeId",protect,hrAdminOnly,assignRfid);

export default router;

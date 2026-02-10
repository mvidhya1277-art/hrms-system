import cron from "node-cron";
import AttendanceLog from "../models/AttendanceLog.js";
import Company from "../models/Company.js";
import Holiday from "../models/Holiday.js";
import { isWorkingDay } from "../utils/workingDay.util.js";
import { applyAttendanceRules } from "../utils/attendanceRule.util.js";
import { hhmmToHours } from "../utils/time.util.js";

export const startAutoCheckoutCron = () => {
  // 🔁 Run every minute attendance.outTime = endTime;
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // 🔥 Fetch active companies
        const companies = await Company.find({ isActive: true }).lean();

        for (const company of companies) {
          const endTime = company.officeTimings?.endTime;
          if (!endTime) continue;

          /* ---------------- HOLIDAYS ---------------- */
          const holidayDocs = await Holiday.find({
            companyId: company.companyId,
          }).lean();

          const holidaySet = new Set(holidayDocs.map(h => h.date));

          /* ---------------- WORKING DAY CHECK ---------------- */
          const todayDateObj = new Date(today);

          // ⛔ Skip if today is NOT a working day
          if (!isWorkingDay(todayDateObj, company, holidaySet)) {
            continue;
          }

          /* ---------------- TIME CHECK ---------------- */
          const [endH, endM] = endTime.split(":").map(Number);
          const officeEndMinutes = endH * 60 + endM;

          if (currentMinutes < officeEndMinutes) continue;

          /* ---------------- AUTO CHECKOUT ---------------- */
          const records = await AttendanceLog.find({
            companyId: company.companyId,
            date: today,
            inTime: { $exists: true },
            $or: [{ outTime: { $exists: false } }, { outTime: null }],
          });

          for (const attendance of records) {
            const [inH, inM] = attendance.inTime
              .split(":")
              .map(Number);

            const inMinutes = inH * 60 + inM;
            const workedMinutes = Math.max(
              officeEndMinutes - inMinutes,
              0
            );

            const hours = Math.floor(workedMinutes / 60);
            const minutes = workedMinutes % 60;

            attendance.outTime = endTime;
            attendance.workingHours =
              `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            attendance.autoCheckout = true;

            // 🔥 APPLY ATTENDANCE RULES
            const workingHoursDecimal = hhmmToHours(attendance.workingHours);

            const { status, isLate } = applyAttendanceRules({
              inTime: attendance.inTime,
              outTime: attendance.outTime,
              officeStartTime: company.officeTimings.startTime,
              gracePeriodMinutes: company.attendanceRules?.gracePeriodMinutes || 0,
              workingHours: workingHoursDecimal,
              halfDayHours: company.attendanceRules?.halfDayHours || 4,
              absentHours: company.attendanceRules?.absentHours || 2,
            });

            attendance.status = status;
            attendance.isLate = isLate;

            await attendance.save();

          }

          if (records.length) {
            console.log(
              `✅ Auto-checkout: ${records.length} employees | ${company.companyName}`
            );
          }
        }
      } catch (err) {
        console.error("❌ Auto-checkout cron error:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

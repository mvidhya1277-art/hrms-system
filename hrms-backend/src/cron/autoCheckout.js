import cron from "node-cron";
import AttendanceLog from "../models/AttendanceLog.js";

const WORKDAY_END_TIME = "19:00";

export const startAutoCheckoutCron = () => {
  cron.schedule(
    "0 19 * * *",
    async () => {
      try {
        // 🔥 IST-safe date
        const now = new Date();
        const year = now.getFullYear();
        const monthNum = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const today = `${year}-${monthNum}-${day}`;

        const records = await AttendanceLog.find({
          date: today,
          inTime: { $exists: true },
          $or: [{ outTime: { $exists: false } }, { outTime: null }],
        });

        for (const attendance of records) {
          const [inH, inM, inS] = attendance.inTime.split(":").map(Number);
          const [outH, outM] = WORKDAY_END_TIME.split(":").map(Number);

          const inDate = new Date();
          inDate.setHours(inH, inM, inS || 0, 0);

          const outDate = new Date();
          outDate.setHours(outH, outM, 0, 0);

          let diffMs = outDate - inDate;
          if (diffMs < 0) diffMs = 0;

          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

          attendance.outTime = WORKDAY_END_TIME;
          attendance.workingHours =
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
          attendance.autoCheckout = true;

          await attendance.save();
        }

        console.log(`Auto-checkout completed: ${records.length} employees`);
      } catch (err) {
        console.error("Auto-checkout cron error:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

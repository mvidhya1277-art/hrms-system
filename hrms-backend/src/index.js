import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import rfidRoutes from "./routes/rfid.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { startAutoCheckoutCron } from "./cron/autoCheckout.js";
import authRoutes from "./routes/auth.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import companyRoutes from "./routes/company.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import holidayRoutes from "./routes/holiday.routes.js";
import payslipRoutes from "./routes/payslip.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/rfid", rfidRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/payslip", payslipRoutes);

app.get("/", (req, res) => {
  res.send("HRMS RFID API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
  startAutoCheckoutCron();
});

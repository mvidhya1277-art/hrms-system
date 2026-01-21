import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  empCode: String,
  employeeName: String,

  companyId: String,
  month: String,

  attendance: {
    totalWorkingDays: Number,
    presentDays: Number,
    leaveDays: Number,
    halfDays: Number,
    absentDays: Number,
  },

  salary: {
    basicSalary: Number,
    deductions: Number,
    netSalary: Number,
  },

  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payslip", payslipSchema);

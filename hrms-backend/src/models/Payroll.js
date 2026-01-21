import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    empCode: {
      type: String,
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    companyId: {
      type: String,
      required: true,
    },

    month: {
      type: String, // "2026-01"
      required: true,
    },

    // Attendance summary
    totalWorkingDays: {
      type: Number,
      required: true,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    leaveDays: {
      type: Number,
      default: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
    },

    halfDays: {
      type: Number,
      default: 0,
    },

    // Salary details
    basicSalary: {
      type: Number,
      required: true,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    generatedBy: {
      type: String,
      enum: ["admin", "system"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);

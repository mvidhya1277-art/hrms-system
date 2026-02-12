import mongoose from "mongoose";

const payrollSettingsSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
    },

    pf: {
      enabled: { type: Boolean, default: false },
      employeePercent: { type: Number, default: 12 },
      employerPercent: { type: Number, default: 12 },
    },

    esi: {
      enabled: { type: Boolean, default: false },
      employeePercent: { type: Number, default: 0.75 },
      employerPercent: { type: Number, default: 3.25 },
      salaryLimit: { type: Number, default: 21000 },
    },

    professionalTax: {
      enabled: { type: Boolean, default: false },
      slabs: [
        {
          min: Number,
          max: Number,
          amount: Number,
        },
      ],
    },

    lateAbsentRules: {
      graceMinutes: { type: Number, default: 0 },
      lateCountForHalfDay: { type: Number, default: 3 },
      halfDayCountForAbsent: { type: Number, default: 2 },
    },

    payslip: {
      showPF: { type: Boolean, default: true },
      showESI: { type: Boolean, default: true },
      showProfessionalTax: { type: Boolean, default: true },
      showLateDeduction: { type: Boolean, default: true },
      footerNote: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PayrollSettings", payrollSettingsSchema);

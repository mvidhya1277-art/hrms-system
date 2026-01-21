import mongoose from "mongoose";

const attendanceLogSchema = new mongoose.Schema(
  {
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    companyId: {
      type: String,
      required: true
    },
    empCode: String,
    employeeName: String,
    companyName: String,
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    inTime: String,
    outTime: String,
    autoCheckout: {
      type: Boolean,
      default: false,
    },
    isLate: {
      type: Boolean,
      default: false
    },
    workingHours: {
      type: String // format: "HH:mm"
    },
    status: {
      type: String,
      enum: ["Present", "absent", "leave", "halfday"],
      default: "Present"
    },
  },
  { timestamps: true }
);

const AttendanceLog = mongoose.model("AttendanceLog", attendanceLogSchema);
export default AttendanceLog;

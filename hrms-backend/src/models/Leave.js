import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    fromDate: {
      type: String,
      required: true,
    },

    toDate: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["full", "half"],
      default: "full",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);

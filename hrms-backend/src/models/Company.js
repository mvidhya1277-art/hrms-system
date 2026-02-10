import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      unique: true,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    logo: {
      type: String, // image URL or filename
      default: null,
    },

    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
    },

    officeTimings: {
      startTime: {
        type: String, // "09:30"
        required: true,
        default: "09:30",
      },
      endTime: {
        type: String, // "18:30"
        required: true,
        default: "18:30",
      },
    },

    weekends: {
      sundayOff: {
        type: Boolean,
        default: true,
      },
      saturday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        offWeeks: {
          type: [Number], // [2, 4]
          default: [2, 4],
          enum: [1, 2, 3, 4, 5],
        },
      },
    },
    
    attendanceRules: {
      gracePeriodMinutes: {
        type: Number,
        default: 0, // eg: 15
      },
      halfDayHours: {
        type: Number,
        default: 4, // eg: <4 hrs = half day
      },
      absentHours: {
        type: Number,
        default: 2, // eg: <2 hrs = absent
      },
    },


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);

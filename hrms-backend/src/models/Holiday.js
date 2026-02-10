import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  date: {
    type: String, // "YYYY-MM-DD"
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

holidaySchema.index({ companyId: 1, date: 1 }, { unique: true });

export default mongoose.model("Holiday", holidaySchema);

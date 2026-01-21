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

export default mongoose.model("Holiday", holidaySchema);

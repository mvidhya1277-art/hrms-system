import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyId: { type: String, unique: true, required: true },
    companyName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);

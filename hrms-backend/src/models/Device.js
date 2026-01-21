import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptionExpiry: {
      type: Date,
      required: false,
    },
    companyId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
export default Device;

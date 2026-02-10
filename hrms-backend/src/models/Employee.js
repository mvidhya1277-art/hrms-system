import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    empCode: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    rfidUid: {
      type: String,
      unique: true,
      sparse: true, // 👈 allows admin without RFID initially
    },

    companyId: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    staffType: {
      type: String,
      enum: ["employee", "admin", "super_admin"],
      default: "employee",
    },
    salary: {
      type: Number,
      required: true,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

// 🔐 hash password
employeeSchema.pre("save", async function () {
  // ⛔ do nothing if password not changed
  if (!this.isModified("password")) return;

  // ⛔ prevent double-hashing
  if (this.password.startsWith("$2b$")) return;

  // ✅ hash only plain-text passwords
  this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.methods.comparePassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("Employee", employeeSchema);

import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";

const generateToken = (payload) => {
  return jwt.sign(
    { ...payload },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    // ===============================
    // 1️⃣ ADMIN LOGIN
    // ===============================
    // const admin = await Admin.findOne({ phone });
    const admin = await Admin.findOne({
      phone,
      role: { $in: ["hr_admin", "super_admin"] },
    });

    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      let companyId = admin.companyId;
      let companyName = admin.companyName;

      // 🔥 Self-heal company fields
      if (!companyId || !companyName) {
        const emp = await Employee.findById(admin.employeeId);
        if (!emp) {
          return res.status(500).json({ message: "Admin company not linked" });
        }

        companyId = emp.companyId;
        companyName = emp.companyName;
        admin.companyId = companyId;
        admin.companyName = companyName;
        await admin.save();
      }

      // 🔥 Self-heal employee link
      let employee = null;

      if (admin.employeeId) {
        employee = await Employee.findById(admin.employeeId);
      }

      if (!employee) {
        employee = await Employee.findOne({
          phone: admin.phone,
          companyId,
        });

        if (employee) {
          admin.employeeId = employee._id;
          await admin.save();
        }
      }

      const token = generateToken({
        id: admin._id,
        role: admin.role,
        userType: "admin",
        companyId,
        companyName,
        employeeId: employee?._id || null,
      });

      return res.json({
        message: "Login successful",
        token,
        user: {
          _id: admin._id,
          role: admin.role,
          userType: "admin",
          companyId,
          companyName,
          name: employee?.name || admin.fullName,
          phone: employee?.phone || admin.phone,
          employeeId: employee?._id || null,
        },
      });
    }

    // ===============================
    // 2️⃣ EMPLOYEE LOGIN
    // ===============================
    const employee = await Employee.findOne({
      phone,
      staffType: "employee",
    });

    if (!employee) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    const token = generateToken({
      id: employee._id,
      role: "employee",
      userType: "employee",
      companyId: employee.companyId,
      companyName: employee.companyName,
      employeeId: employee._id,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: employee._id,
        name: employee.name,
        phone: employee.phone,
        role: "employee",
        userType: "employee",
        companyId: employee.companyId,
        companyName: employee.companyName,
        employeeId: employee._id,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

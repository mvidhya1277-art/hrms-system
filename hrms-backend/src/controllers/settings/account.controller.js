import Employee from "../../models/Employee.js";
import Admin from "../../models/Admin.js";

/* ===============================
   GET MY PROFILE (Admin)
================================ */
export const getMyProfile = async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(req.user.employeeId).select(
      "-password"
    );

    if (!employee) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(employee);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   UPDATE PROFILE (Admin)
================================ */
// export const updateProfile = async (req, res) => {
//   try {
//     if (req.user.userType !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { name, phone } = req.body;

//     const employee = await Employee.findById(req.user.employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     if (name) employee.name = name;
//     if (phone) employee.phone = phone;

//     await employee.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: {
//         name: employee.name,
//         phone: employee.phone,
//         theme: employee.theme,
//       },
//     });
//   } catch (err) {
//     console.error("UPDATE PROFILE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, phone } = req.body;

    // 1️⃣ Update employee
    const employee = await Employee.findByIdAndUpdate(
      req.user.employeeId,
      { name, phone },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2️⃣ Update admin using employeeId
    await Admin.findOneAndUpdate(
      { employeeId: employee._id },
      {
        phone,
        fullName: name,
      }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        name: employee.name,
        phone: employee.phone,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// export const changePassword = async (req, res) => {
//   try {
//     if (req.user.userType !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Current and new password required" });
//     }

//     const employee = await Employee.findById(req.user.employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const isMatch = await employee.comparePassword(currentPassword);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ message: "Current password is incorrect" });
//     }

//     if (currentPassword === newPassword) {
//       return res
//         .status(400)
//         .json({ message: "New password must be different" });
//     }

//     // 🔐 Update EMPLOYEE password (will be hashed by schema)
//     employee.password = newPassword;
//     await employee.save();

//     // 🔐 Sync ADMIN password with same hashed value
//     await Admin.findOneAndUpdate(
//       { employeeId: employee._id },
//       { password: employee.password }
//     );

//     res.json({ message: "Password changed successfully" });
//   } catch (err) {
//     console.error("CHANGE PASSWORD ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const changePassword = async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { currentPassword, newPassword } = req.body;

    const employee = await Employee.findById(req.user.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const isMatch = await employee.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    // 1️⃣ Update employee password
    employee.password = newPassword;
    await employee.save();

    // 2️⃣ Update admin password (same hash logic)
    const admin = await Admin.findOne({ employeeId: employee._id });
    if (admin) {
      admin.password = newPassword;
      await admin.save();
    }

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// /* ===============================
//    UPDATE THEME (Admin)
// ================================ */
// export const updateTheme = async (req, res) => {
//   try {
//     if (req.user.userType !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { theme } = req.body;

//     if (!["light", "dark"].includes(theme)) {
//       return res.status(400).json({ message: "Invalid theme value" });
//     }

//     const employee = await Employee.findByIdAndUpdate(
//       req.user.employeeId,
//       { theme },
//       { new: true }
//     );

//     res.json({
//       message: "Theme updated",
//       theme: employee.theme,
//     });
//   } catch (err) {
//     console.error("UPDATE THEME ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

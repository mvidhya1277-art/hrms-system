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

// export const login = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     if (!phone || !password) {
//       return res.status(400).json({ message: "Phone and password required" });
//     }

//     // 1️⃣ ADMIN LOGIN
//     const admin = await Admin.findOne({ phone });
//     if (!admin) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (admin) {
//       const isMatch = await admin.comparePassword(password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid phone or password" });
//       }

//       let companyId = admin.companyId;
//       let companyName = admin.companyName;

//       // 🔥 Self-heal old admins
//       if (!companyId || !companyName) {
//         const employee = await Employee.findById(admin.employeeId);
//         if (!employee) {
//           return res.status(500).json({ message: "Admin company not linked" });
//         }

//         companyId = employee.companyId;
//         companyName = employee.companyName;

//         admin.companyId = companyId;
//         admin.companyName = companyName;
//         await admin.save();
//       }

//       const employee = await Employee.findById(admin.employeeId);

//       const token = generateToken({
//         id: admin._id,
//         role: admin.role,
//         userType: "admin",
//         companyId: admin.companyId,
//         companyName: admin.companyName,
//         employeeId: employee ? employee._id : null,
//       });

//       return res.json({
//         message: "Login successful",
//         token,
//         user: {
//           _id: admin._id,
//           role: admin.role,
//           userType: "admin",
//           companyId: admin.companyId,
//           companyName: admin.companyName,

//           // ✅ ADD THESE
//           name: employee?.name || admin.fullName,
//           phone: employee?.phone || admin.phone,
//           employeeId: employee?._id || null,
//         },
//       });
//     }

//     // 2️⃣ EMPLOYEE LOGIN
//     const employee = await Employee.findOne({ phone });
//     console.log("👤 employee found:", employee?.phone);

//     if (!employee) {
//       return res.status(401).json({ message: "Invalid phone or password" });
//     }

//     console.log("📥 entered password:", password);
//     console.log("🔐 stored hash:", employee.password);

//     const isMatch = await employee.comparePassword(password);
    
//     console.log("✅ bcrypt result:", isMatch);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid phone or password" });
//     }


//     const token = generateToken({
//       id: employee._id,
//       role: "employee",
//       userType: "employee",
//       companyId: employee.companyId,
//       companyName: employee.companyName,
//     });

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: employee._id,
//         name: employee.name,
//         phone: employee.phone,
//         role: "employee",
//         userType: "employee",
//         companyId: employee.companyId,
//         companyName: employee.companyName,
//       },
//     });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
//generateToken 
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    // ===============================
    // 1️⃣ TRY ADMIN LOGIN FIRST
    // ===============================
    const admin = await Admin.findOne({ phone });

    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      let companyId = admin.companyId;
      let companyName = admin.companyName;

      // 🔥 Self-heal old admins
      if (!companyId || !companyName) {
        const employee = await Employee.findById(admin.employeeId);
        if (!employee) {
          return res.status(500).json({ message: "Admin company not linked" });
        }

        companyId = employee.companyId;
        companyName = employee.companyName;

        admin.companyId = companyId;
        admin.companyName = companyName;
        await admin.save();
      }

      const employee = await Employee.findById(admin.employeeId);

      const token = generateToken({
        id: admin._id,
        role: admin.role,
        userType: "admin",
        companyId,
        companyName,
        employeeId: employee ? employee._id : null,
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
    const employee = await Employee.findOne({ phone });

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
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

import Device from "../models/Device.js";
import Employee from "../models/Employee.js";
import Admin from "../models/Admin.js";
import Company from "../models/Company.js";

/*SUPER ADMIN → REGISTER DEVICE*/
export const registerDevice = async (req, res) => {
  try {
    const { deviceId, subscriptionExpiry, companyId } = req.body;

    if (!deviceId || !companyId) {
      return res.status(400).json({ message: "Device ID and companyId required" });
    }

    const exists = await Device.findOne({ deviceId });
    if (exists) {
      return res.status(400).json({ message: "Device already exists" });
    }

    const device = await Device.create({
      deviceId,
      subscriptionExpiry,
      companyId,
    });

    res.status(201).json({
      message: "Device registered successfully",
      device,
    });
  } catch {
    console.error("Regiter device error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/*HR ADMIN → ADD EMPLOYEE*/

export const addEmployee = async (req, res) => {
  try {
    const { name, empCode, phone, password, rfidUid, salary } = req.body;

    // 🔴 Validation
    if (!name || !empCode || !phone || !password || salary === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔒 Phone must be unique system-wide
    const phoneExists =
      (await Employee.findOne({ phone })) ||
      (await Admin.findOne({ phone }));

    if (phoneExists) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    // 🔒 RFID must be unique (if provided)
    if (rfidUid) {
      const uidExists = await Employee.findOne({ rfidUid });
      if (uidExists) {
        return res.status(400).json({ message: "RFID already assigned" });
      }
    }

    // 🔥 SAFELY RESOLVE COMPANY (JWT → DB fallback)
    let companyId = req.user.companyId;
    let companyName = req.user.companyName;

    if (!companyId || !companyName) {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(401).json({ message: "Invalid admin" });
      }
      companyId = admin.companyId;
      companyName = admin.companyName;
    }

    // 🔒 Employee code unique per company
    const empCodeExists = await Employee.findOne({
      empCode,
      companyId,
    });

    if (empCodeExists) {
      return res.status(400).json({ message: "Employee code already exists" });
    }

    // ✅ CREATE EMPLOYEE
    const employee = await Employee.create({
      name,
      empCode,
      phone,
      password,
      rfidUid: rfidUid || null,
      salary: Number(salary),   // 🔥 IMPORTANT
      staffType: "employee",
      companyId,
      companyName,
    });

    res.status(201).json({
      message: "Employee registered successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        empCode: employee.empCode,
        phone: employee.phone,
        companyId: employee.companyId,
      },
    });
  } catch (err) {
    console.error("ADD EMPLOYEE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* HR ADMIN → LIST EMPLOYEES*/
export const getEmployees = async (req, res) => {
  const employees = await Employee.find({
    companyId: req.user.companyId,
    staffType: "employee", // 🔥 IMPORTANT
    isDeleted: { $ne: true }
  });

  res.json(employees);
};

/* SUPER ADMIN → CREATE ADMIN*/
export const createAdmin = async (req, res) => {
  try {
    const { fullName, phone, password, role, companyId } = req.body;

    // 🔐 Only Super Admin reaches here (middleware already applied)
    if (!fullName || !phone || !password || !companyId) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Validate company
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 🔒 Phone uniqueness across system
    const exists =
      (await Admin.findOne({ phone })) ||
      (await Employee.findOne({ phone }));

    if (exists) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    // 1️⃣ Create Employee record (admins also scan RFID)
    const employee = await Employee.create({
      name: fullName,
      empCode: `ADM-${Date.now()}`,
      phone,
      password,
      staffType: "admin",
      companyId: company.companyId,
      companyName: company.companyName,
    });

    // 2️⃣ Create Admin record
    const admin = await Admin.create({
      fullName,
      phone,
      password,
      role: role || "hr_admin",
      employeeId: employee._id,
      companyId: company.companyId,
      companyName: company.companyName,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        role: admin.role,
        companyId: admin.companyId,
      },
    });
  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

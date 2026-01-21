import Device from "../models/Device.js";
import Employee from "../models/Employee.js";
import AttendanceLog from "../models/AttendanceLog.js";

const OFFICE_START_TIME = "09:30:00";

const calculateWorkingHours = (inTime, outTime) => {
  const [inH, inM, inS] = inTime.split(":").map(Number);
  const [outH, outM, outS] = outTime.split(":").map(Number);

  const inDate = new Date();
  inDate.setHours(inH, inM, inS, 0);

  const outDate = new Date();
  outDate.setHours(outH, outM, outS, 0);

  let diffMs = outDate - inDate;
  if (diffMs < 0) diffMs = 0; // safety

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const handleRfidScan = async (req, res) => {
  try {
    const { uid, device_id } = req.body;

    if (!uid || !device_id) {
      return res.send("invalid|Missing Parameters");
    }

    // 🔥 IST-safe DATE & TIME (NO toISOString)
    const now = new Date();

    const year = now.getFullYear();
    const monthNum = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const dateStr = `${year}-${monthNum}-${day}`; // ✅ CORRECT IST DATE
    const month = `${year}-${monthNum}`;          // YYYY-MM

    const currentTime = now.toLocaleTimeString("en-GB", {
      hour12: false,
      timeZone: "Asia/Kolkata",
    });

    // 1️⃣ Check device
    const device = await Device.findOne({ deviceId: device_id });
    if (!device) return res.send("expired|Device not registered");

    if (device.subscriptionExpiry && device.subscriptionExpiry < new Date()) {
      return res.send("expired|Your subscription is over");
    }

    // 2️⃣ Find employee
    const employee = await Employee.findOne({
      rfidUid: uid,
      companyId: device.companyId,
    });
    if (!employee) return res.send("unknown|Unknown UID");

    // 🔍 Find today attendance
    let attendance = await AttendanceLog.findOne({
      empId: employee._id,
      date: dateStr,   // ✅ now matches correctly
    });

    // ---------- CHECK-IN ----------
    if (!attendance) {
      const isLate = currentTime > OFFICE_START_TIME;

      await AttendanceLog.create({
        empId: employee._id,
        empCode: employee.empCode,
        employeeName: employee.name,
        companyId: employee.companyId,
        companyName: employee.companyName,

        date: dateStr,   // ✅ IST DATE
        month,

        inTime: currentTime,
        isLate,
        status: "Present",
        autoCheckout: false,
      });

      return res.send(`check-in|${employee.name}`);
    }

    // ---------- ALREADY AUTO CHECKED OUT ----------
    if (attendance.autoCheckout === true) {
      return res.send(`already|Already Checked Out`);
    }

    // ---------- MANUAL CHECK-OUT ----------
    attendance.outTime = currentTime;
    attendance.workingHours = calculateWorkingHours(
      attendance.inTime,
      currentTime
    );

    await attendance.save();

    return res.send(`check-out|${employee.name}`);
  } catch (error) {
    console.error("RFID scan error:", error);
    return res.send("error|Server Error");
  }
};


export const assignRfid = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { rfidUid } = req.body;

    if (!rfidUid) {
      return res.status(400).json({ message: "RFID UID required" });
    }

    // Ensure RFID not already used
    const exists = await Employee.findOne({ rfidUid });
    if (exists) {
      return res.status(400).json({ message: "RFID already assigned" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.rfidUid = rfidUid;
    await employee.save();

    res.json({
      message: "RFID assigned successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        rfidUid: employee.rfidUid,
      },
    });
  } catch (err) {
    console.error("ASSIGN RFID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

import Payroll from "../models/Payroll.js";
import AttendanceLog from "../models/AttendanceLog.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Holiday from "../models/Holiday.js";
//holidays 

/* ---------------- HELPERS ---------------- */

// check if saturday is even (2nd, 4th saturday)
const isEvenSaturday = (date) => {
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  return weekOfMonth % 2 === 0;
};//getEmployeePayroll

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d; // YYYY-MM-DD
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const getLeaveSummary = async (employeeId, workingDays, month) => {
  const [year, mon] = month.split("-");
  const monthStart = `${year}-${mon}-01`;
  const monthEnd = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;

  const approvedLeaves = await Leave.find({
    employeeId,
    status: "approved",
  });

  let fullDayLeaves = new Set();
  let halfDayLeaves = 0;

  approvedLeaves.forEach((l) => {
    const from = normalizeDate(l.fromDate);
    const to = normalizeDate(l.toDate);

    let d = from;
    while (d <= to) {
      // only consider this month
      if (d >= monthStart && d <= monthEnd) {

        if ((l.leaveType || "").toLowerCase() === "half") {
          // ✅ HALF DAY
          if (workingDays.includes(d)) {
            halfDayLeaves += 1;
          }
        } else {
          // ✅ FULL DAY
          if (workingDays.includes(d)) {
            fullDayLeaves.add(d);
          }
        }
      }

      // next day
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      d = normalizeDate(nd);
    }
  });

  return {
    fullDayLeaves: fullDayLeaves.size,
    halfDayLeaves,
  };
};
//attendanceLogs

// build working days of month based on rules
const getWorkingDaysInMonth = (year, month, holidays) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const day = date.getDay(); // 0=Sun, 6=Sat
    const dateStr = date.toISOString().slice(0, 10);

    // ❌ Sunday
    if (day === 0) continue;

    // ❌ Even Saturday
    if (day === 6 && isEvenSaturday(date)) continue;

    // ❌ Company holiday
    if (holidays.includes(dateStr)) continue;

    // ✅ Working day
    workingDays.push(dateStr);
  }
  return workingDays; // ["YYYY-MM-DD", ...]
};

// expand approved leaves into actual dates
/* ---------------- GENERATE PAYROLL ---------------- */

export const generatePayroll = async (req, res) => {
  try {
    if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { employeeId, month } = req.body;
    if (!employeeId || !month) {
      return res.status(400).json({ message: "employeeId and month are required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const [year, mon] = month.split("-");

    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;

    const attendanceLogs = await AttendanceLog.find({
      empId: employeeId,                     // ✅ correct field
      companyId: req.user.companyId,
      date: { $gte: startDate, $lte: endDate },
      status: "Present",                     // count only present days
    });

    // Holidays
    const holidayDocs = await Holiday.find({
      companyId: req.user.companyId,
    });
    const holidays = holidayDocs.map(h => h.date);


    const workingDays = getWorkingDaysInMonth(+year, +mon, holidays);
    const totalWorkingDays = workingDays.length;

    if (!totalWorkingDays) {
      return res.status(400).json({ message: "No working days for this month" });
    }

    // 🔥 FIRST: get leave summary
    const { fullDayLeaves, halfDayLeaves } =
      await getLeaveSummary(employeeId, workingDays, month);

    // ✅ Present days = full present + half-day present
    const presentDays =
      attendanceLogs.length + (halfDayLeaves * 0.5);

    // Leave in days
    const totalLeaveInDays =
      fullDayLeaves + halfDayLeaves * 0.5;

    // Paid leave rule
    const paidLeave = Math.min(1, totalLeaveInDays);
    const lopLeave = totalLeaveInDays - paidLeave;

    // Absent
    const absentDays = Math.max(
      totalWorkingDays - presentDays - totalLeaveInDays,
      0
    );

    // Salary
    const basicSalary = employee.salary;
    const perDaySalary = basicSalary / totalWorkingDays;

    const deductionDays = absentDays + lopLeave;
    const deductions = Math.round(deductionDays * perDaySalary);
    const netSalary = Math.max(
      Math.round(basicSalary - deductions),
      0
    );

    // prevent duplicate payroll
    const existing = await Payroll.findOne({
      employeeId,
      month,
      companyId: req.user.companyId,
    });
    if (existing) {
      return res.status(400).json({
        message: "Payroll already generated for this employee and month",
      });
    }

    const payroll = await Payroll.create({
      employeeId,
      empCode: employee.empCode,
      employeeName: employee.name,
      companyId: req.user.companyId,
      month,

      totalWorkingDays,
      presentDays,
      leaveDays: fullDayLeaves,
      absentDays,
      halfDays: halfDayLeaves,

      basicSalary,
      deductions,
      netSalary,

      generatedBy: "admin",
    });

    res.status(201).json({ message: "Payroll generated successfully", payroll });
  } catch (err) {
    console.error("PAYROLL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ---------------- GETTERS (unchanged) ---------------- */

export const getAllPayrolls = async (req, res) => {
  try {
    if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const payrolls = await Payroll.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const getEmployeePayroll = async (req, res) => {
//   try {
//     if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const payrolls = await Payroll.find({
//       employeeId: req.params.id,
//       companyId: req.user.companyId,
//     }).sort({ month: -1 });
//     res.json(payrolls);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getEmployeePayroll = async (req, res) => {
  try {
    if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔥 FIX: fallback to logged-in user's employeeId
    const employeeId = req.params.id || req.user.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required",
      });
    }

    const payrolls = await Payroll.find({
      employeeId,
      companyId: req.user.companyId,
    }).sort({ month: -1 });

    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      employeeId: req.user.employeeId,
      companyId: req.user.companyId,
    }).sort({ month: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- RECALCULATE PAYROLL ---------------- */

export const recalculatePayroll = async (req, res) => {
  try {
    if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { payrollId } = req.params;

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    const employee = await Employee.findById(payroll.employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const [year, mon] = payroll.month.split("-");

    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;

    const attendanceLogs = await AttendanceLog.find({
      empId: payroll.employeeId,
      companyId: payroll.companyId,
      date: { $gte: startDate, $lte: endDate },
      status: "Present",
    });

    const holidayDocs = await Holiday.find({
      companyId: payroll.companyId,
    });
    const holidays = holidayDocs.map(h => h.date);


    const workingDays = getWorkingDaysInMonth(+year, +mon, holidays);
    const totalWorkingDays = workingDays.length;

    // 🔥 FIRST: get leave summary
    const { fullDayLeaves, halfDayLeaves } =
      await getLeaveSummary(
        payroll.employeeId,
        workingDays,
        payroll.month
      );

    // ✅ Present days = full present + half-day present
    const presentDays =
      attendanceLogs.length + (halfDayLeaves * 0.5);

    const totalLeaveInDays =
      fullDayLeaves + halfDayLeaves * 0.5;

    const paidLeave = Math.min(1, totalLeaveInDays);
    const lopLeave = totalLeaveInDays - paidLeave;

    const absentDays = Math.max(
      totalWorkingDays - presentDays - totalLeaveInDays,
      0
    );

    const basicSalary = employee.salary;
    const perDaySalary = basicSalary / totalWorkingDays;

    const deductionDays = absentDays + lopLeave;
    const deductions = Math.round(deductionDays * perDaySalary);
    const netSalary = Math.max(
      Math.round(basicSalary - deductions),
      0
    );

    payroll.totalWorkingDays = totalWorkingDays;
    payroll.presentDays = presentDays;
    payroll.leaveDays = fullDayLeaves;
    payroll.absentDays = absentDays;
    payroll.halfDays = halfDayLeaves;
    payroll.basicSalary = basicSalary;
    payroll.deductions = deductions;
    payroll.netSalary = netSalary;

    await payroll.save();

    res.json({ message: "Payroll recalculated successfully", payroll });
  } catch (err) {
    console.error("RECALCULATE PAYROLL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const generateBulkPayroll = async (req, res) => {
  try {
    if (!["hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { month } = req.body;
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const employees = await Employee.find({
      companyId: req.user.companyId,
      isDeleted: { $ne: true }, // 🔥 exclude deleted employees
    });

    let success = 0;
    let skipped = 0;

    const [year, mon] = month.split("-");
    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;

    /* ---------------- HOLIDAYS ---------------- */
    const holidayDocs = await Holiday.find({
      companyId: req.user.companyId,
    });
    const holidays = holidayDocs.map(h => h.date);

    const workingDays = getWorkingDaysInMonth(+year, +mon, holidays);
    const totalWorkingDays = workingDays.length;

    if (!totalWorkingDays) {
      return res.status(400).json({ message: "No working days for this month" });
    }

    for (const emp of employees) {
      try {
        /* ---------- prevent duplicate ---------- */
        const exists = await Payroll.findOne({
          employeeId: emp._id,
          month,
          companyId: req.user.companyId,
        });
        if (exists) {
          skipped++;
          continue;
        }

        /* ================= ATTENDANCE ================= */
        const attendanceLogs = await AttendanceLog.find({
          empId: emp._id,
          companyId: req.user.companyId,
          date: { $gte: startDate, $lte: endDate },
        });

        let present = 0;
        let halfFromAttendance = 0;

        attendanceLogs.forEach((a) => {
          const status = (a.status || "").toLowerCase();
          if (status === "present") present++;
          else if (status === "halfday") halfFromAttendance++;
        });

        /* ================= LEAVE ================= */
        const { fullDayLeaves, halfDayLeaves } =
          await getLeaveSummary(emp._id, workingDays, month);

        // ✅ total half days = attendance half + leave half
        const totalHalfDays = halfFromAttendance + halfDayLeaves;

        /* ================= FINAL COUNTS ================= */

        // ✅ Present = full present + half present
        const presentDays = present + totalHalfDays * 0.5;

        // ✅ Leave = full leave + half leave
        const leaveInDays =
          fullDayLeaves + totalHalfDays * 0.5;

        // paid leave rule → max 1 day
        const paidLeaveDays = Math.min(1, leaveInDays);
        const lopLeaveDays = leaveInDays - paidLeaveDays;

        // ✅ Absent
        const absentDays = Math.max(
          totalWorkingDays - presentDays - leaveInDays,
          0
        );

        /* ================= SALARY ================= */

        if (!emp.salary || emp.salary <= 0) {
          console.warn(`❌ Salary missing for ${emp.name}`);
          skipped++;
          continue;
        }

        const basicSalary = emp.salary;
        const perDaySalary = basicSalary / totalWorkingDays;

        const deductions = Math.round(
          (absentDays + lopLeaveDays) * perDaySalary
        );

        const netSalary = Math.max(
          Math.round(basicSalary - deductions),
          0
        );

        /* ================= CREATE PAYROLL ================= */

        await Payroll.create({
          employeeId: emp._id,
          empCode: emp.empCode,
          employeeName: emp.name,
          companyId: req.user.companyId,
          month,

          totalWorkingDays,
          presentDays,
          leaveDays: fullDayLeaves,
          absentDays,
          halfDays: totalHalfDays,   // ✅ correct

          basicSalary,
          deductions,
          netSalary,

          generatedBy: "admin",
        });

        console.log("PAYROLL DEBUG:", {
          emp: emp.name,
          present,
          fullDayLeaves,
          halfFromAttendance,
          halfDayLeaves,
          totalHalfDays,
          leaveInDays,
          paidLeaveDays,
          lopLeaveDays,
          absentDays,
          netSalary,
        });

        success++;
      } catch (e) {
        console.error("BULK PAYROLL ERROR:", emp.name, e.message);
        skipped++;
      }
    }

    res.json({
      message: `Bulk payroll done. Generated: ${success}, Skipped: ${skipped}`,
    });
  } catch (err) {
    console.error("BULK PAYROLL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllPayrollsForCompany = async (req, res) => {
  try {
    if (!["hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const payrolls = await Payroll.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (err) {
    console.error("GET ALL PAYROLLS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




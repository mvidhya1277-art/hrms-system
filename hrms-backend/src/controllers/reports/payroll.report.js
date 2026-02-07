import Payroll from "../../models/Payroll.js";
import Employee from "../../models/Employee.js";

/* ---------------- PAYROLL REPORT ---------------- */

export const getPayrollReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { month, employeeId } = req.query;

    // 🔹 default = current month
    if (!month) {
      const d = new Date();
      month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
      isDeleted: { $ne: true }, // 🔥 hide deleted employees
    };


    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
    }

    if (employeeId) {
      employeeQuery._id = employeeId;
    }

    const employees = await Employee.find(employeeQuery, {
      _id: 1,
      name: 1,
    });

    // ✅ safeguard
    if (employees.length === 0) {
      return res.json({
        filters: { month, employeeId: employeeId || null },
        summary: {
          totalEmployeesPaid: 0,
          totalBasicSalary: 0,
          totalDeductions: 0,
          totalPayout: 0,
        },
        records: [],
      });
    }

    const employeeIds = employees.map(e => e._id);
    const employeeMap = {};
    employees.forEach(e => {
      employeeMap[e._id.toString()] = e.name;
    });

    /* ---------------- PAYROLL DATA ---------------- */

    const payrolls = await Payroll.find({
      companyId,
      month,
      employeeId: { $in: employeeIds },
    }).sort({ employeeName: 1 });

    /* ---------------- SUMMARY ---------------- */

    let totalEmployeesPaid = payrolls.length;
    let totalBasicSalary = 0;
    let totalDeductions = 0;
    let totalPayout = 0;

    payrolls.forEach(p => {
      totalBasicSalary += p.basicSalary || 0;
      totalDeductions += p.deductions || 0;
      totalPayout += p.netSalary || 0;
    });

    /* ---------------- RECORDS ---------------- */

    const records = payrolls.map(p => ({
      employeeId: p.employeeId,
      employeeName: employeeMap[p.employeeId.toString()] || p.employeeName,
      month: p.month,
      totalWorkingDays: p.totalWorkingDays,
      presentDays: p.presentDays,
      absentDays: p.absentDays,
      deductions: p.deductions,
      netSalary: p.netSalary,
    }));

    /* ---------------- RESPONSE ---------------- */

    res.json({
      filters: {
        month,
        employeeId: employeeId || null,
      },
      summary: {
        totalEmployeesPaid,
        totalBasicSalary,
        totalDeductions,
        totalPayout,
      },
      records,
    });

  } catch (err) {
    console.error("PAYROLL REPORT ERROR:", err);
    res.status(500).json({ message: "Payroll report error" });
  }
};

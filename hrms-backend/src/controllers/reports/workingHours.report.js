import AttendanceLog from "../../models/AttendanceLog.js";
import Employee from "../../models/Employee.js";

/* ---------------- HELPERS ---------------- */

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d;
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const parseHours = (hhmm) => {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

/* ---------------- WORKING HOURS REPORT ---------------- */

export const getWorkingHoursReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { fromDate, toDate, employeeId } = req.query;

    const today = normalizeDate(new Date());
    fromDate = normalizeDate(fromDate) || today;
    toDate = normalizeDate(toDate) || fromDate;

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
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
        summary: {
          totalEmployeesWorked: 0,
          totalPresentDays: 0,
          averageWorkingHours: 0,
          lateCount: 0,
        },
        records: [],
      });
    }

    const employeeIds = employees.map(e => e._id);
    const employeeMap = {};
    employees.forEach(e => {
      employeeMap[e._id.toString()] = e.name;
    });

    /* ---------------- ATTENDANCE LOGS ---------------- */

    const attendanceLogs = await AttendanceLog.find({
      companyId,
      empId: { $in: employeeIds },
      date: { $gte: fromDate, $lte: toDate },
      status: "Present",
    });

    // ✅ no logs = empty working hours
    if (attendanceLogs.length === 0) {
      return res.json({
        filters: { fromDate, toDate, employeeId: employeeId || null },
        summary: {
          totalEmployeesWorked: 0,
          totalPresentDays: 0,
          averageWorkingHours: 0,
          lateCount: 0,
        },
        records: [],
      });
    }

    /* ---------------- AGGREGATION ---------------- */

    const workMap = {};
    let totalHours = 0;
    let lateCount = 0;

    attendanceLogs.forEach(log => {
      const empId = log.empId.toString();

      if (!workMap[empId]) {
        workMap[empId] = {
          employeeId: empId,
          employeeName: employeeMap[empId],
          presentDays: 0,
          totalHours: 0,
        };
      }

      workMap[empId].presentDays += 1;

      if (log.workingHours) {
        const hrs = parseHours(log.workingHours);
        workMap[empId].totalHours += hrs;
        totalHours += hrs;
      }

      if (log.isLate === true) {
        lateCount++;
      }
    });

    /* ---------------- BUILD RECORDS ---------------- */

    const records = Object.values(workMap).map(r => ({
      employeeId: r.employeeId,
      employeeName: r.employeeName,
      presentDays: r.presentDays,
      averageHours:
        r.presentDays > 0 ? Number((r.totalHours / r.presentDays).toFixed(2)) : 0,
    }));

    /* ---------------- SUMMARY ---------------- */

    const totalPresentDays = records.reduce(
      (sum, r) => sum + r.presentDays,
      0
    );

    const averageWorkingHours =
      totalPresentDays > 0
        ? Number((totalHours / totalPresentDays).toFixed(2))
        : 0;

    res.json({
      filters: {
        fromDate,
        toDate,
        employeeId: employeeId || null,
      },
      summary: {
        totalEmployeesWorked: records.length,
        totalPresentDays,
        averageWorkingHours,
        lateCount,
      },
      records,
    });

  } catch (err) {
    console.error("WORKING HOURS REPORT ERROR:", err);
    res.status(500).json({ message: "Working hours report error" });
  }
};

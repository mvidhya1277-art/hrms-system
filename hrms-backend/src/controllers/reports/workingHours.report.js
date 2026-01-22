import AttendanceLog from "../../models/AttendanceLog.js";
import Employee from "../../models/Employee.js";

/* ---------------- HELPERS ---------------- */

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d;
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

/* ---------------- WORKING HOURS REPORT ---------------- */

export const getWorkingHoursReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { fromDate, toDate, employeeId } = req.query;

    // 🔹 default = today
    const today = normalizeDate(new Date());
    fromDate = normalizeDate(fromDate) || today;
    toDate = normalizeDate(toDate) || fromDate;

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
    };

    // employee can see only self
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

    /* ---------------- AGGREGATION ---------------- */

    const workMap = {};
    attendanceLogs.forEach(log => {
      const empId = log.empId.toString();

      if (!workMap[empId]) {
        workMap[empId] = {
          employeeId: empId,
          employeeName: employeeMap[empId],
          presentDays: 0,
          firstCheckIn: null,
        };
      }

      workMap[empId].presentDays += 1;

      // earliest check-in
      if (log.inTime) {
        if (
          !workMap[empId].firstCheckIn ||
          log.inTime < workMap[empId].firstCheckIn
        ) {
          workMap[empId].firstCheckIn = log.inTime;
        }
      }
    });

    /* ---------------- BUILD RECORDS ---------------- */

    const records = Object.values(workMap);

    /* ---------------- SUMMARY ---------------- */

    const totalEmployeesWorked = records.length;
    const totalPresentDays = records.reduce(
      (sum, r) => sum + r.presentDays,
      0
    );

    res.json({
      filters: {
        fromDate,
        toDate,
        employeeId: employeeId || null,
      },
      summary: {
        totalEmployeesWorked,
        totalPresentDays,
      },
      records,
    });

  } catch (err) {
    console.error("WORKING HOURS REPORT ERROR:", err);
    res.status(500).json({ message: "Working hours report error" });
  }
};

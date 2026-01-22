import AttendanceLog from "../../models/AttendanceLog.js";
import Employee from "../../models/Employee.js";

/* ---------------- HELPERS ---------------- */

const getMonthRange = (month) => {
  const [year, mon] = month.split("-");
  const start = `${year}-${mon}-01`;
  const end = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;
  return { start, end };
};

/* ---------------- PERFORMANCE REPORT ---------------- */

export const getPerformanceReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { month } = req.query;

    // 🔹 default = current month
    if (!month) {
      const d = new Date();
      month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }

    const { start, end } = getMonthRange(month);

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
    };

    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
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

    /* ---------------- ATTENDANCE DATA ---------------- */

    const attendanceLogs = await AttendanceLog.find({
      companyId,
      empId: { $in: employeeIds },
      date: { $gte: start, $lte: end },
    });

    /* ---------------- AGGREGATION ---------------- */

    const perfMap = {};

    attendanceLogs.forEach(log => {
      const empId = log.empId.toString();

      if (!perfMap[empId]) {
        perfMap[empId] = {
          employeeId: empId,
          employeeName: employeeMap[empId],
          presentDays: 0,
          lateCount: 0,
        };
      }

      if ((log.status || "").toLowerCase() === "present") {
        perfMap[empId].presentDays += 1;
      }

      if (log.isLate === true) {
        perfMap[empId].lateCount += 1;
      }
    });

    /* ---------------- FINAL METRICS ---------------- */

    const totalDaysInMonth = Object.keys(
      attendanceLogs.reduce((acc, l) => {
        acc[l.date] = true;
        return acc;
      }, {})
    ).length || 1;

    const records = [];

    employees.forEach(emp => {
      const empId = emp._id.toString();
      const data = perfMap[empId] || {
        presentDays: 0,
        lateCount: 0,
      };

      const attendancePercentage = Math.round(
        (data.presentDays / totalDaysInMonth) * 100
      );

      let performanceTag = "Needs Support";

      if (attendancePercentage >= 90 && data.lateCount <= 2) {
        performanceTag = "Top Performer";
      } else if (attendancePercentage >= 75) {
        performanceTag = "Average";
      }

      records.push({
        employeeId: empId,
        employeeName: employeeMap[empId],
        presentDays: data.presentDays,
        lateCount: data.lateCount,
        attendancePercentage,
        performanceTag,
      });
    });

    /* ---------------- SUMMARY ---------------- */

    const topPerformer = records.find(r => r.performanceTag === "Top Performer") || null;
    const needsSupport = records.find(r => r.performanceTag === "Needs Support") || null;

    /* ---------------- RESPONSE ---------------- */

    res.json({
      filters: { month },
      summary: {
        topPerformer,
        needsSupport,
      },
      records,
    });

  } catch (err) {
    console.error("PERFORMANCE REPORT ERROR:", err);
    res.status(500).json({ message: "Performance report error" });
  }
};

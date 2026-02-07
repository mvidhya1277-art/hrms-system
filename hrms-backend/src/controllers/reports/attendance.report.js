import AttendanceLog from "../../models/AttendanceLog.js";
import Employee from "../../models/Employee.js";

/* ---------------- HELPERS ---------------- */

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d; // YYYY-MM-DD
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const getDateRange = (from, to) => {
  const dates = [];
  let d = new Date(from);
  const end = new Date(to);

  while (d <= end) {
    dates.push(normalizeDate(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

/* ---------------- ATTENDANCE REPORT ---------------- */

export const getAttendanceReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { type = "monthly", date, month, employeeId } = req.query;

    const today = normalizeDate(new Date());
    let fromDate, toDate;

    if (type === "daily") {
      fromDate = normalizeDate(date) || today;
      toDate = fromDate;
    } else {
      if (month) {
        const [y, m] = month.split("-");
        fromDate = `${y}-${m}-01`;
        toDate = `${y}-${m}-${new Date(y, m, 0).getDate()}`;
      } else {
        fromDate = today;
        toDate = today;
      }
    }

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId: req.user.companyId,
      staffType: "employee",
      isDeleted: { $ne: true }, // 🔥 exclude deleted employees
    };

    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
    }
    if (employeeId) employeeQuery._id = employeeId;

    const employees = await Employee.find(employeeQuery, {
      _id: 1,
      name: 1,
    });

    if (employees.length === 0) {
      return res.json({
        summary: {
          totalEmployees: 0,
          avgPresent: 0,
          avgAbsent: 0,
          avgLate: 0,
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
    });

    const attendanceMap = {};
    attendanceLogs.forEach(log => {
      if (!attendanceMap[log.date]) attendanceMap[log.date] = {};
      attendanceMap[log.date][log.empId.toString()] = log;
    });

    /* ---------------- SUMMARY + RECORDS ---------------- */

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    const records = [];

    const dates = getDateRange(fromDate, toDate);

    for (const date of dates) {
      for (const emp of employees) {
        const empId = emp._id.toString();
        const log = attendanceMap?.[date]?.[empId];

        if (log) {
          presentCount++;
          if (log.isLate === true) lateCount++;

          records.push({
            date,
            employeeId: empId,
            employeeName: employeeMap[empId],
            status: "P",
            checkIn: log.inTime || null,
            checkOut: log.outTime || null,
            workingHours: log.workingHours || null,
            isLate: log.isLate === true,
          });
        } else {
          absentCount++;

          records.push({
            date,
            employeeId: empId,
            employeeName: employeeMap[empId],
            status: "A",
            checkIn: null,
            checkOut: null,
            workingHours: null,
            isLate: false,
          });
        }
      }
    }

    /* ---------------- AVERAGES ---------------- */

    const totalEmployees = employees.length;

    const avgPresent = Number((presentCount / totalEmployees).toFixed(2));
    const avgAbsent = Number((absentCount / totalEmployees).toFixed(2));
    const avgLate = Number((lateCount / totalEmployees).toFixed(2));

    /* ---------------- RESPONSE ---------------- */

    res.json({
      filters: { fromDate, toDate, employeeId: employeeId || null },
      summary: {
        totalEmployees,
        avgPresent,
        avgAbsent,
        avgLate,
      },
      records,
    });

  } catch (err) {
    console.error("ATTENDANCE REPORT ERROR:", err);
    res.status(500).json({ message: "Attendance report error" });
  }
};

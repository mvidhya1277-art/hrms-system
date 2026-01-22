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

    let { fromDate, toDate, employeeId } = req.query;

    /* ---------- DEFAULT DATE = TODAY ---------- */
    const today = normalizeDate(new Date());
    fromDate = normalizeDate(fromDate) || today;
    toDate = normalizeDate(toDate) || fromDate;

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
    };

    // Employee can see only their own data
    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
    }

    // Filter by employee (admin/hr)
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

    const totalEmployees = employeeIds.length;

    /* ---------------- ATTENDANCE LOGS ---------------- */

    const attendanceLogs = await AttendanceLog.find({
      companyId,
      empId: { $in: employeeIds },
      date: { $gte: fromDate, $lte: toDate },
    });

    /* ---------------- BUILD DATE → EMP MAP ---------------- */

    const attendanceMap = {};
    attendanceLogs.forEach(a => {
      if (!attendanceMap[a.date]) attendanceMap[a.date] = {};
      attendanceMap[a.date][a.empId.toString()] = a;
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
            checkIn: log.inTime || null,     // ✅ CORRECT FIELD
            checkOut: null,                  // not stored yet
            workingHours: null,              // can be calculated later
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

    /* ---------------- RESPONSE ---------------- */

    res.json({
      filters: {
        fromDate,
        toDate,
        employeeId: employeeId || null,
      },
      summary: {
        totalEmployees,
        presentCount,
        absentCount,
        lateCount,
      },
      records,
    });

  } catch (err) {
    console.error("ATTENDANCE REPORT ERROR:", err);
    res.status(500).json({ message: "Attendance report error" });
  }
};

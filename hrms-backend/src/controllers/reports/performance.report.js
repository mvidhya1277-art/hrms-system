// import AttendanceLog from "../../models/AttendanceLog.js";
// import Employee from "../../models/Employee.js";

// /* ---------------- HELPERS ---------------- */

// const getMonthRange = (month) => {
//   const [year, mon] = month.split("-");
//   const start = `${year}-${mon}-01`;
//   const end = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`;
//   return { start, end };
// };

// /* ---------------- PERFORMANCE REPORT ---------------- */

// export const getPerformanceReport = async (req, res) => {
//   try {
//     const companyId = req.user.companyId;
//     let { month } = req.query;

//     // 🔹 default = current month
//     if (!month) {
//       const d = new Date();
//       month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//     }

//     const { start, end } = getMonthRange(month);

//     /* ---------------- EMPLOYEES ---------------- */

//     const employeeQuery = {
//       companyId,
//       staffType: "employee",
//     };

//     if (req.user.role === "employee") {
//       employeeQuery._id = req.user.employeeId;
//     }

//     const employees = await Employee.find(employeeQuery, {
//       _id: 1,
//       name: 1,
//     });

//     // ✅ safeguard
//     if (employees.length === 0) {
//       return res.json({
//         filters: { month },
//         summary: {
//           top: 0,
//           average: 0,
//           needsSupport: 0,
//         },
//         records: [],
//       });
//     }

//     const employeeIds = employees.map(e => e._id);
//     const employeeMap = {};
//     employees.forEach(e => {
//       employeeMap[e._id.toString()] = e.name;
//     });

//     /* ---------------- ATTENDANCE DATA ---------------- */

//     const attendanceLogs = await AttendanceLog.find({
//       companyId,
//       empId: { $in: employeeIds },
//       date: { $gte: start, $lte: end },
//     });

//     /* ---------------- AGGREGATION ---------------- */

//     const perfMap = {};

//     attendanceLogs.forEach(log => {
//       const empId = log.empId.toString();

//       if (!perfMap[empId]) {
//         perfMap[empId] = {
//           presentDays: 0,
//           lateCount: 0,
//         };
//       }

//       if ((log.status || "").toLowerCase() === "present") {
//         perfMap[empId].presentDays += 1;
//       }

//       if (log.isLate === true) {
//         perfMap[empId].lateCount += 1;
//       }
//     });

//     /* ---------------- FINAL METRICS ---------------- */

//     const totalDaysInMonth =
//       new Date(Number(month.split("-")[0]), Number(month.split("-")[1]), 0).getDate();

//     let top = 0;
//     let average = 0;
//     let needsSupport = 0;

//     const records = employees.map(emp => {
//       const empId = emp._id.toString();
//       const data = perfMap[empId] || { presentDays: 0, lateCount: 0 };

//       const attendancePercentage =
//         totalDaysInMonth > 0
//           ? Math.round((data.presentDays / totalDaysInMonth) * 100)
//           : 0;

//       let performanceTag = "Needs Support";

//       if (attendancePercentage >= 90 && data.lateCount <= 2) {
//         performanceTag = "Top Performer";
//         top++;
//       } else if (attendancePercentage >= 75) {
//         performanceTag = "Average";
//         average++;
//       } else {
//         needsSupport++;
//       }

//       return {
//         employeeId: empId,
//         employeeName: employeeMap[empId],
//         presentDays: data.presentDays,
//         lateCount: data.lateCount,
//         attendancePercentage,
//         performanceTag,
//       };
//     });

//     /* ---------------- RESPONSE ---------------- */

//     res.json({
//       filters: { month },
//       summary: {
//         top,
//         average,
//         needsSupport,
//       },
//       records,
//     });

//   } catch (err) {
//     console.error("PERFORMANCE REPORT ERROR:", err);
//     res.status(500).json({ message: "Performance report error" });
//   }
// };

import AttendanceLog from "../../models/AttendanceLog.js";
import Employee from "../../models/Employee.js";

/* ---------------- HELPERS ---------------- */

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d;
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

/* ---------------- PERFORMANCE REPORT ---------------- */

export const getPerformanceReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { type = "monthly", date, month } = req.query;

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

    const employees = await Employee.find(
      {
        companyId,
        staffType: "employee",
        isDeleted: { $ne: true }, // 🔥 exclude deleted employees
      },
      { _id: 1, name: 1 }
    );

    if (!employees.length) {
      return res.json({
        summary: {
          top: 0,
          average: 0,
          needsSupport: 0,
          avgAttendance: 0,
          avgLate: 0,
        },
        records: [],
      });
    }

    const employeeIds = employees.map(e => e._id.toString());

    /* ---------------- LOGS ---------------- */

    const logs = await AttendanceLog.find({
      companyId,
      empId: { $in: employeeIds },
      date: { $gte: fromDate, $lte: toDate },
    });

    const perfMap = {};
    logs.forEach(log => {
      const id = log.empId.toString();
      if (!perfMap[id]) perfMap[id] = { present: 0, late: 0 };

      if ((log.status || "").toLowerCase() === "present") perfMap[id].present++;
      if (log.isLate === true) perfMap[id].late++;
    });

    const totalDays =
      type === "daily" ? 1 :
        new Date(Number(month.split("-")[0]), Number(month.split("-")[1]), 0).getDate();

    let top = 0, average = 0, needsSupport = 0;
    let sumAttendance = 0, sumLate = 0;

    const records = employees.map(emp => {
      const d = perfMap[emp._id] || { present: 0, late: 0 };
      const percent = totalDays > 0 ? Math.round((d.present / totalDays) * 100) : 0;

      sumAttendance += percent;
      sumLate += d.late;

      let tag = "Needs Support";
      if (percent >= 90 && d.late <= 2) {
        tag = "Top Performer";
        top++;
      } else if (percent >= 75) {
        tag = "Average";
        average++;
      } else {
        needsSupport++;
      }

      return {
        employeeId: emp._id,
        employeeName: emp.name,
        attendancePercentage: percent,
        lateCount: d.late,
        performanceTag: tag,
      };
    });

    const avgAttendance =
      records.length ? Number((sumAttendance / records.length).toFixed(2)) : 0;

    const avgLate =
      records.length ? Number((sumLate / records.length).toFixed(2)) : 0;

    res.json({
      filters: { fromDate, toDate },
      summary: {
        top,
        average,
        needsSupport,
        avgAttendance,
        avgLate,
      },
      records,
    });

  } catch (err) {
    console.error("PERFORMANCE REPORT ERROR:", err);
    res.status(500).json({ message: "Performance report error" });
  }
};

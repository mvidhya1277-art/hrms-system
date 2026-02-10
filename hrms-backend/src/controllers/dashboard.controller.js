// import Employee from "../models/Employee.js";
// import AttendanceLog from "../models/AttendanceLog.js";
// import Leave from "../models/Leave.js";

// const toMinutes = (hhmm) => {
//   const [h, m] = hhmm.split(":").map(Number);
//   return (h * 60) + m;
// };

// const toHHMM = (totalMinutes) => {
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;
//   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
// };

// export const getEmployeeDashboard = async (req, res) => {
//   try {
//     const employeeId = req.user._id;

//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const todayAttendance = await AttendanceLog.findOne({
//       employee: employeeId,
//       date: { $gte: start, $lte: end }
//     });

//     const monthStart = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       1
//     );

//     const totalDays = await AttendanceLog.countDocuments({
//       employee: employeeId,
//       date: { $gte: monthStart }
//     });

//     const presentDays = await AttendanceLog.countDocuments({
//       employee: employeeId,
//       date: { $gte: monthStart },
//       status: "P"
//     });

//     const monthAttendancePercent =
//       totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

//     res.status(200).json({
//       todayStatus: todayAttendance?.status || "A",
//       checkIn: todayAttendance?.checkIn || null,
//       workingHours: todayAttendance?.workingHours || "0h",
//       monthAttendancePercent
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Employee dashboard error" });
//   }
// };

// export const getAdminDashboard = async (req, res) => {
//   try {
//     const today = new Date().toISOString().slice(0, 10);

//     const yesterdayDate = new Date();
//     yesterdayDate.setDate(yesterdayDate.getDate() - 1);
//     const yesterday = yesterdayDate.toISOString().slice(0, 10);

//     const companyId = req.user.companyId;

//     // 1️⃣ Employees (exclude admins)
//     const employees = await Employee.find(
//       {
//         companyId,
//         staffType: "employee",
//         isDeleted: { $ne: true }, // 🔥 exclude deleted
//       },
//       { _id: 1, name: 1 }
//     );


//     const employeeIds = employees.map(e => e._id);
//     const employeeNameMap = {};
//     employees.forEach(e => {
//       employeeNameMap[e._id.toString()] = e.name;
//     });

//     const totalEmployees = employeeIds.length;

//     // 2️⃣ Present today (distinct employees)
//     const presentEmpIds = await AttendanceLog.distinct("empId", {
//       companyId,
//       date: today,
//       empId: { $in: employeeIds }
//     });
//     const presentToday = presentEmpIds.length;

//     // 3️⃣ On leave today
//     const onLeave = await Leave.countDocuments({
//       employeeId: { $in: employeeIds },
//       status: "approved",
//       fromDate: { $lte: today },
//       toDate: { $gte: today }
//     });

//     // 4️⃣ Pending leaves
//     const pendingLeaves = await Leave.countDocuments({
//       employeeId: { $in: employeeIds },
//       status: "pending"
//     });

//     // 5️⃣ Absent
//     const absentToday = Math.max(
//       totalEmployees - presentToday - onLeave,
//       0
//     );

//     // 6️⃣ Late check-ins
//     const lateEmpIds = await AttendanceLog.distinct("empId", {
//       companyId,
//       date: today,
//       empId: { $in: employeeIds },
//       isLate: true
//     });
//     const lateCheckins = lateEmpIds.length;

//     // 7️⃣ Working hours calculations
//     const yesterdayAttendance = await AttendanceLog.find({
//       companyId,
//       date: yesterday,
//       empId: { $in: employeeIds },
//       workingHours: { $exists: true }
//     });

//     let totalMinutes = 0;
//     let longest = null;
//     let shortest = null;

//     for (const r of yesterdayAttendance) {
//       if (!r.workingHours) continue;

//       const [h, m] = r.workingHours.split(":").map(Number);
//       const minutes = (h * 60) + m;
//       totalMinutes += minutes;

//       if (!longest || minutes > longest.minutes) {
//         longest = {
//           empId: r.empId,
//           minutes,
//           workingHours: r.workingHours
//         };
//       }

//       if (!shortest || minutes < shortest.minutes) {
//         shortest = {
//           empId: r.empId,
//           minutes,
//           workingHours: r.workingHours
//         };
//       }
//     }

//     const totalWorkingHoursYesterday =
//       totalMinutes > 0
//         ? `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`
//         : "00:00";

//     const uniqueEmployeesYesterday = new Set(
//       yesterdayAttendance.map(a => a.empId.toString())
//     ).size;

//     const averageWorkingHoursYesterday =
//       uniqueEmployeesYesterday > 0
//         ? `${String(
//           Math.floor((totalMinutes / uniqueEmployeesYesterday) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((totalMinutes / uniqueEmployeesYesterday) % 60)
//         ).padStart(2, "0")}`
//         : "00:00";


//     res.status(200).json({
//       totalEmployees,
//       presentToday,
//       absentToday,
//       onLeave,
//       pendingLeaves,
//       lateCheckins,
//       totalWorkingHoursYesterday,
//       averageWorkingHoursYesterday,
//       longestWorkingEmployee: longest
//         ? {
//           name: employeeNameMap[longest.empId.toString()],
//           workingHours: longest.workingHours
//         }
//         : null,
//       shortestWorkingEmployee: shortest
//         ? {
//           name: employeeNameMap[shortest.empId.toString()],
//           workingHours: shortest.workingHours
//         }
//         : null
//     });
//   } catch (error) {
//     console.error("Admin dashboard error:", error);
//     res.status(500).json({ message: "Admin dashboard error" });
//   }
// };

// export const getMonthlyAttendanceChart = async (req, res) => {
//   try {
//     const { year, month } = req.query; // month = 1-12

//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0, 23, 59, 59);

//     const matchStage = {
//       date: { $gte: startDate, $lte: endDate }
//     };

//     // If employee → only their data
//     if (req.user.role === "EMPLOYEE") {
//       matchStage.employee = req.user._id;
//     }

//     const data = await Attendance.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const chart = {
//       present: 0,
//       absent: 0,
//       leave: 0,
//       halfDay: 0
//     };

//     data.forEach(item => {
//       if (item._id === "P") chart.present = item.count;
//       if (item._id === "A") chart.absent = item.count;
//       if (item._id === "L") chart.leave = item.count;
//       if (item._id === "H") chart.halfDay = item.count;
//     });

//     res.status(200).json(chart);
//   } catch (err) {
//     res.status(500).json({ message: "Monthly chart error" });
//   }
// };

import Employee from "../models/Employee.js";
import AttendanceLog from "../models/AttendanceLog.js";
import Leave from "../models/Leave.js";
import Company from "../models/Company.js";
import { getWorkingDaysInMonth } from "../utils/workingDay.util.js";

/* ================= EMPLOYEE DASHBOARD ================= */

export const getEmployeeDashboard = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({
        message: "Employee profile not linked",
      });
    }

    const employeeId = req.user.employeeId;
    const today = new Date().toISOString().slice(0, 10);

    /* ---------- TODAY ATTENDANCE ---------- */
    const todayAttendance = await AttendanceLog.findOne({
      empId: employeeId,
      date: today,
    });

    /* ---------- MONTH ATTENDANCE % ---------- */
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company settings not found",
      });
    }

    const workingDays = await getWorkingDaysInMonth(
      year,
      month,
      company
    );

    const attendanceLogs = await AttendanceLog.find({
      empId: employeeId,
      companyId: req.user.companyId,
      date: {
        $gte: `${year}-${String(month).padStart(2, "0")}-01`,
        $lte: today,
      },
    });

    let presentDays = 0;

    attendanceLogs.forEach(a => {
      const status = (a.status || "").toLowerCase();
      if (status === "present") presentDays += 1;
      else if (status === "halfday") presentDays += 0.5;
    });

    const monthAttendancePercent =
      workingDays.length === 0
        ? 0
        : Math.round((presentDays / workingDays.length) * 100);

    res.json({
      todayStatus: todayAttendance?.status || "Absent",
      checkIn: todayAttendance?.inTime || null,
      workingHours: todayAttendance?.workingHours || "00:00",
      monthAttendancePercent,
    });
  } catch (error) {
    console.error("EMPLOYEE DASHBOARD ERROR:", error);
    res.status(500).json({
      message: "Employee dashboard error",
    });
  }
};

/* ================= ADMIN DASHBOARD ================= */

export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const companyId = req.user.companyId;

    /* ---------- EMPLOYEES ---------- */
    const employees = await Employee.find(
      {
        companyId,
        staffType: "employee",
        isDeleted: { $ne: true },
      },
      { _id: 1, name: 1 }
    );

    const employeeIds = employees.map(e => e._id);
    const employeeNameMap = {};
    employees.forEach(e => {
      employeeNameMap[e._id.toString()] = e.name;
    });

    const totalEmployees = employeeIds.length;

    /* ---------- PRESENT TODAY ---------- */
    const presentEmpIds = await AttendanceLog.distinct("empId", {
      companyId,
      date: today,
      empId: { $in: employeeIds },
    });

    const presentToday = presentEmpIds.length;

    /* ---------- LEAVES ---------- */
    const onLeave = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      status: "approved",
      fromDate: { $lte: today },
      toDate: { $gte: today },
    });

    const pendingLeaves = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      status: "pending",
    });

    /* ---------- ABSENT ---------- */
    const absentToday = Math.max(
      totalEmployees - presentToday - onLeave,
      0
    );

    /* ---------- LATE CHECK-INS ---------- */
    const lateCheckins = await AttendanceLog.countDocuments({
      companyId,
      date: today,
      empId: { $in: employeeIds },
      isLate: true,
    });

    /* ---------- YESTERDAY WORK HOURS ---------- */
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const yesterdayAttendance = await AttendanceLog.find({
      companyId,
      date: yesterdayStr,
      empId: { $in: employeeIds },
      workingHours: { $exists: true },
    });

    let totalMinutes = 0;
    let longest = null;
    let shortest = null;

    yesterdayAttendance.forEach(r => {
      const [h, m] = (r.workingHours || "0:0").split(":").map(Number);
      const minutes = h * 60 + m;
      totalMinutes += minutes;

      if (!longest || minutes > longest.minutes) {
        longest = { empId: r.empId, minutes, workingHours: r.workingHours };
      }

      if (!shortest || minutes < shortest.minutes) {
        shortest = { empId: r.empId, minutes, workingHours: r.workingHours };
      }
    });

    const uniqueEmployees = new Set(
      yesterdayAttendance.map(a => a.empId.toString())
    ).size;

    res.json({
      totalEmployees,
      presentToday,
      absentToday,
      onLeave,
      pendingLeaves,
      lateCheckins,
      totalWorkingHoursYesterday:
        totalMinutes > 0
          ? `${Math.floor(totalMinutes / 60)}:${String(
              totalMinutes % 60
            ).padStart(2, "0")}`
          : "00:00",
      averageWorkingHoursYesterday:
        uniqueEmployees > 0
          ? `${Math.floor(
              totalMinutes / uniqueEmployees / 60
            )}:${String(
              Math.floor((totalMinutes / uniqueEmployees) % 60)
            ).padStart(2, "0")}`
          : "00:00",
      longestWorkingEmployee: longest
        ? {
            name: employeeNameMap[longest.empId.toString()],
            workingHours: longest.workingHours,
          }
        : null,
      shortestWorkingEmployee: shortest
        ? {
            name: employeeNameMap[shortest.empId.toString()],
            workingHours: shortest.workingHours,
          }
        : null,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({
      message: "Admin dashboard error",
    });
  }
};

export const getMonthlyAttendanceChart = async (req, res) => {
  try {
    const { year, month } = req.query; // month = 1-12

    if (!year || !month) {
      return res.status(400).json({
        message: "year and month are required",
      });
    }

    /* ---------- EMPLOYEE CONTEXT ---------- */
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee profile not linked",
      });
    }

    /* ---------- COMPANY SETTINGS ---------- */
    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company settings not found",
      });
    }

    /* ---------- WORKING DAYS ---------- */
    const workingDays = await getWorkingDaysInMonth(
      +year,
      +month,
      company
    );

    const workingDaySet = new Set(workingDays);

    /* ---------- ATTENDANCE ---------- */
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(
      year,
      month,
      0
    ).getDate()}`;

    const attendanceLogs = await AttendanceLog.find({
      empId: employeeId,
      companyId: req.user.companyId,
      date: { $gte: startDate, $lte: endDate },
    });

    let present = 0;
    let halfDay = 0;

    attendanceLogs.forEach(a => {
      if (!workingDaySet.has(a.date)) return;

      const status = (a.status || "").toLowerCase();
      if (status === "present") present += 1;
      else if (status === "halfday") halfDay += 1;
    });

    /* ---------- LEAVES ---------- */
    const leaves = await Leave.find({
      employeeId,
      status: "approved",
    });

    let leaveDays = new Set();

    leaves.forEach(l => {
      let d = new Date(l.fromDate);
      const end = new Date(l.toDate);

      d.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (d <= end) {
        const ds = d.toISOString().slice(0, 10);
        if (workingDaySet.has(ds)) {
          leaveDays.add(ds);
        }
        d.setDate(d.getDate() + 1);
      }
    });

    /* ---------- FINAL CALCULATION ---------- */
    const presentDays = present + halfDay * 0.5;
    const leaveCount = leaveDays.size;
    const totalWorkingDays = workingDays.length;

    const absent =
      totalWorkingDays - presentDays - leaveCount > 0
        ? totalWorkingDays - presentDays - leaveCount
        : 0;

    res.json({
      present,
      halfDay,
      leave: leaveCount,
      absent,
      totalWorkingDays,
    });
  } catch (error) {
    console.error("MONTHLY ATTENDANCE CHART ERROR:", error);
    res.status(500).json({
      message: "Monthly attendance chart error",
    });
  }
};
import AttendanceLog from "../models/AttendanceLog.js";
import Admin from "../models/Admin.js";
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import getEmployeeId from "../helpers/getEmployeeId.js";
import Company from "../models/Company.js";
import { isWorkingDay } from "../utils/workingDay.util.js";
import Holiday from "../models/Holiday.js";
import { toLocalDateString } from "../utils/date.util.js";


// 1️⃣ Today attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const logs = await AttendanceLog.find({ date: today, ...req.companyFilter })
      .populate("empId", "name empCode")
      .sort({ inTime: 1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Attendance by date (YYYY-MM-DD)
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const logs = await AttendanceLog.find({ date, ...req.companyFilter })
      .populate("empId", "name empCode")
      .sort({ inTime: 1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });//dateStr 
  }
};

// 3️⃣ Employee-wise attendance
export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;

    const logs = await AttendanceLog.find({ empId, ...req.companyFilter })
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req);

    const logs = await AttendanceLog.find({ empId: employeeId })
      .sort({ date: -1 });

    res.json({
      message: "Attendance fetched successfully",
      attendance: logs,
    });
  } catch (err) {
    console.error("MY ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// export const attendanceLeaveReport = async (req, res) => {
//   try {
//     let employeeId;

//     // 1️⃣ Admin viewing employee calendar
//     if (req.params.employeeId) {
//       if (req.user.userType !== "admin") {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const targetEmployee = await Employee.findById(req.params.employeeId);
//       if (!targetEmployee) {
//         return res.status(404).json({ message: "Employee not found" });
//       }

//       employeeId = targetEmployee._id;//weekends
//     }

//     // 2️⃣ Admin viewing OWN calendar
//     else if (req.user.userType === "admin") {
//       if (!req.user.employeeId) {
//         return res.status(400).json({
//           message: "Admin employeeId missing in token",
//         });
//       }
//       employeeId = req.user.employeeId;
//     }

//     // 3️⃣ Normal employee
//     else {
//       employeeId = await getEmployeeId(req);
//     }

//     /* ------------------------------ */
//     const { year, month } = req.query;
//     if (!year || !month) {
//       return res.status(400).json({ message: "year and month are required" });
//     }

//     const start = new Date(year, month - 1, 1);
//     const end = new Date(year, month, 0);

//     start.setHours(0, 0, 0, 0);
//     end.setHours(0, 0, 0, 0);

//     /* ------------------------------ */
//     // 🔵 Company settings
//     const company = await Company.findOne({
//       companyId: req.user.companyId,
//       isActive: true,
//     });

//     if (!company) {
//       return res.status(404).json({ message: "Company settings not found" });
//     }

//     /* ------------------------------ */
//     // 🔵 Holidays
//     const holidayDocs = await Holiday.find({
//       companyId: company.companyId,
//     }).lean();

//     const holidaySet = new Set(holidayDocs.map(h => h.date));

//     /* ------------------------------ */
//     // 🟢 Attendance
//     const attendance = await AttendanceLog.find({
//       empId: employeeId,
//       date: {
//         $gte: start.toISOString().slice(0, 10),
//         $lte: end.toISOString().slice(0, 10),
//       },
//     }).lean();

//     /* ------------------------------ */
//     // 🔴 Approved leaves
//     const leaves = await Leave.find({
//       employeeId,
//       status: "approved",
//       fromDate: { $lte: end.toISOString().slice(0, 10) },
//       toDate: { $gte: start.toISOString().slice(0, 10) },
//     }).lean();

//     /* ------------------------------ */
//     // 🟡 Build FULL month calendar
//     const calendar = {};
//     let cursor = new Date(start);

//     while (cursor <= end) {
//       const ds = cursor.toISOString().slice(0, 10);

//       calendar[ds] = {
//         date: ds,
//         status: isWorkingDay(cursor, company, holidaySet)
//           ? "Absent"
//           : holidaySet.has(ds)
//           ? "Holiday"
//           : "Weekly Off",
//       };

//       cursor.setDate(cursor.getDate() + 1);
//     }

//     /* ------------------------------ */
//     // 🟢 Attendance overrides
//     attendance.forEach(a => {
//       calendar[a.date] = {
//         date: a.date,
//         inTime: a.inTime,
//         outTime: a.outTime,
//         status: "Present",
//       };
//     });

//     /* ------------------------------ */
//     // 🔴 Leave overrides everything
//     leaves.forEach(l => {
//       let d = new Date(l.fromDate);
//       const endDate = new Date(l.toDate);

//       d.setHours(0, 0, 0, 0);
//       endDate.setHours(0, 0, 0, 0);

//       while (d <= endDate) {
//         const ds = d.toISOString().slice(0, 10);

//         calendar[ds] = {
//           date: ds,
//           status: "Leave",
//           leaveType: l.leaveType,
//         };

//         d.setDate(d.getDate() + 1);
//       }
//     });

//     res.json(Object.values(calendar));
//   } catch (err) {
//     console.error("❌ CALENDAR ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const attendanceLeaveReport = async (req, res) => {
  try {
    let employeeId;

    /* ---------------- EMPLOYEE RESOLUTION ---------------- */
    if (req.params.employeeId) {
      if (!["admin", "hr_admin", "super_admin"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const targetEmployee = await Employee.findById(req.params.employeeId);
      if (!targetEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      employeeId = targetEmployee._id;
    } else {
      employeeId = req.user.employeeId || await getEmployeeId(req);
    }

    /* ---------------- QUERY ---------------- */
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: "year and month are required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    /* ---------------- COMPANY ---------------- */
    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company settings not found" });
    }

    /* ---------------- HOLIDAYS ---------------- */
    const holidays = await Holiday.find({
      companyId: company.companyId,
    }).lean();

    const holidaySet = new Set(holidays.map(h => h.date));

    /* ---------------- ATTENDANCE ---------------- */
    const attendance = await AttendanceLog.find({
      empId: employeeId,
      date: {
        $gte: start.toISOString().slice(0, 10),
        $lte: end.toISOString().slice(0, 10),
      },
    }).lean();

    /* ---------------- LEAVES ---------------- */
    const leaves = await Leave.find({
      employeeId,
      status: "approved",
      fromDate: { $lte: end.toISOString().slice(0, 10) },
      toDate: { $gte: start.toISOString().slice(0, 10) },
    }).lean();

    /* ---------------- BASE CALENDAR ---------------- */
    const calendar = {};
    let cursor = new Date(start);

    while (cursor <= end) {
      const ds = cursor.toISOString().slice(0, 10);

      if (holidaySet.has(ds)) {
        calendar[ds] = { date: ds, status: "Holiday" };
      } else if (!isWorkingDay(cursor, company, holidaySet)) {
        calendar[ds] = { date: ds, status: "Weekly Off" };
      } else {
        calendar[ds] = { date: ds, status: "Absent" };
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    /* ---------------- ATTENDANCE OVERRIDE ---------------- */
    attendance.forEach(a => {
      calendar[a.date] = {
        date: a.date,
        inTime: a.inTime,
        outTime: a.outTime,
        status: "Present",
      };
    });

    /* ---------------- LEAVE OVERRIDE (🔥 FIXED) ---------------- */
    leaves.forEach(l => {
      let d = new Date(l.fromDate);
      const endDate = new Date(l.toDate);

      d.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      while (d <= endDate) {
        const ds = d.toISOString().slice(0, 10);

        // 🔥 OVERRIDE EVEN IF ABSENT
        calendar[ds] = {
          date: ds,
          status: "Leave",
          leaveType: l.leaveType, // "half" | "full"
        };

        d.setDate(d.getDate() + 1);
      }
    });

    res.json(Object.values(calendar));
  } catch (err) {
    console.error("❌ CALENDAR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};








import AttendanceLog from "../models/AttendanceLog.js";
import Admin from "../models/Admin.js";
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import getEmployeeId from "../helpers/getEmployeeId.js";


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
    res.status(500).json({ message: "Server error" });
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
//       if (!req.user || req.user.userType !== "admin") {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const targetEmployee = await Employee.findById(req.params.employeeId);
//       if (!targetEmployee) {
//         return res.status(404).json({ message: "Employee not found" });
//       }

//       employeeId = targetEmployee._id;
//     }

//     // 2️⃣ Admin viewing OWN calendar
//     else if (req.user.userType === "admin") {
//       // 🔥 FIND ADMIN'S EMPLOYEE RECORD CORRECTLY
//       const adminEmployee = await Employee.findOne({
//         staffType: "admin",
//         companyId: req.user.companyId,
//       });

//       if (!adminEmployee) {
//         return res.json([]); // admin has no attendance yet
//       }

//       employeeId = adminEmployee._id;
//     }

//     // 3️⃣ Normal employee
//     else {
//       employeeId = await getEmployeeId(req);
//     }

//     // ============================
//     const { year, month } = req.query;
//     if (!year || !month) {
//       return res.status(400).json({ message: "year and month are required" });
//     }//Present 

//     const start = new Date(year, month - 1, 1);
//     const end = new Date(year, month, 0, 23, 59, 59);

//     const startStr = start.toISOString().slice(0, 10);
//     const endStr = end.toISOString().slice(0, 10);

//     const attendance = await AttendanceLog.find({
//       empId: employeeId,
//       date: { $gte: startStr, $lte: endStr },
//     }).lean();

//     const leaves = await Leave.find({
//       employeeId,
//       status: "approved",
//       fromDate: { $lte: endStr },
//       toDate: { $gte: startStr },
//     }).lean();

//     const attendanceMap = {};
//     attendance.forEach(a => {
//       attendanceMap[a.date] = {
//         date: a.date,
//         inTime: a.inTime,
//         outTime: a.outTime,
//         status: "Present",
//       };
//     });

//     const leaveMap = {};
//     leaves.forEach(l => {
//       let d = new Date(l.fromDate);
//       const endD = new Date(l.toDate);

//       while (d <= endD) {
//         const dateStr = d.toISOString().slice(0, 10);
//         if (dateStr >= startStr && dateStr <= endStr) {
//           leaveMap[dateStr] = {
//             date: dateStr,
//             status: "Leave",
//             leaveType: l.leaveType,
//             reason: l.reason,
//           };
//         }
//         d.setDate(d.getDate() + 1);
//       }
//     });

//     const result = [];
//     const allDates = new Set([
//       ...Object.keys(attendanceMap),
//       ...Object.keys(leaveMap),
//     ]);

//     [...allDates].sort().forEach(date => {
//       if (leaveMap[date]) {
//         if (leaveMap[date].leaveType === "half" && attendanceMap[date]) {
//           result.push({
//             ...attendanceMap[date],
//             status: "Leave",
//             leaveType: "half",
//             reason: leaveMap[date].reason,
//           });
//         } else {
//           result.push(leaveMap[date]);
//         }
//       } else {
//         result.push(attendanceMap[date]);
//       }
//     });

//     res.json(result);
//   } catch (err) {
//     console.error("❌ CALENDAR ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

//       employeeId = targetEmployee._id;
//     }

//     // 2️⃣ Admin viewing OWN calendar (🔥 FIXED)
//     else if (req.user.userType === "admin") {
//       if (!req.user.employeeId) {
//         return res.status(400).json({
//           message: "Admin employeeId missing in token",
//         });
//       }

//       employeeId = req.user.employeeId; // 🔥 FINAL & CORRECT
//     }
//     // 3️⃣ Normal employee viewing own calendar
//     else {
//       employeeId = await getEmployeeId(req);
//     }

//     // ------------------------------
//     const { year, month } = req.query;
//     if (!year || !month) {
//       return res.status(400).json({ message: "year and month are required" });
//     }

//     const startStr = `${year}-${String(month).padStart(2, "0")}-01`;
//     const endStr = `${year}-${String(month).padStart(2, "0")}-31`;

//     const attendance = await AttendanceLog.find({
//       empId: employeeId,
//       date: { $gte: startStr, $lte: endStr },
//     }).lean();

//     const leaves = await Leave.find({
//       employeeId,
//       status: "approved",
//       fromDate: { $lte: endStr },
//       toDate: { $gte: startStr },
//     }).lean();

//     const map = {};

//     attendance.forEach(a => {
//       map[a.date] = {
//         date: a.date,
//         inTime: a.inTime,
//         outTime: a.outTime,
//         status: "Present",
//       };
//     });

//     leaves.forEach(l => {
//       let d = new Date(l.fromDate);
//       const end = new Date(l.toDate);
//       while (d <= end) {
//         const ds = d.toISOString().slice(0, 10);
//         if (!map[ds]) {
//           map[ds] = {
//             date: ds,
//             status: "Leave",
//             leaveType: l.leaveType,
//           };
//         }
//         d.setDate(d.getDate() + 1);
//       }
//     });

//     res.json(Object.values(map));
//   } catch (err) {
//     console.error("❌ CALENDAR ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const attendanceLeaveReport = async (req, res) => {
  try {
    let employeeId;

    // 1️⃣ Admin viewing employee calendar
    if (req.params.employeeId) {
      if (req.user.userType !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const targetEmployee = await Employee.findById(req.params.employeeId);
      if (!targetEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      employeeId = targetEmployee._id;
    }

    // 2️⃣ Admin viewing OWN calendar
    else if (req.user.userType === "admin") {
      if (!req.user.employeeId) {
        return res.status(400).json({
          message: "Admin employeeId missing in token",
        });
      }

      employeeId = req.user.employeeId;
    }

    // 3️⃣ Normal employee
    else {
      employeeId = await getEmployeeId(req);
    }

    // ------------------------------
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: "year and month are required" });
    }

    // ✅ Correct month range
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // ------------------------------
    // 🟢 Attendance
    const attendance = await AttendanceLog.find({
      empId: employeeId,
      date: {
        $gte: start.toISOString().slice(0, 10),
        $lte: end.toISOString().slice(0, 10),
      },
    }).lean();

    // 🔴 ALL approved leaves (NO date filter here)
    const allLeaves = await Leave.find({
      employeeId,
      status: "approved",
    }).lean();

    // ------------------------------
    // 🔴 Filter leaves by month SAFELY
    const leaves = allLeaves.filter(l => {
      const from = new Date(l.fromDate);
      const to = new Date(l.toDate);

      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);

      return from <= end && to >= start;
    });

    // ------------------------------
    // Merge logic
    const map = {};

    // 🟢 Attendance first
    attendance.forEach(a => {
      map[a.date] = {
        date: a.date,
        inTime: a.inTime,
        outTime: a.outTime,
        status: "Present",
      };
    });

    // 🔴 Leaves override attendance
    leaves.forEach(l => {
      let d = new Date(l.fromDate);
      const endDate = new Date(l.toDate);

      d.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      while (d <= endDate) {
        const ds = d.toISOString().slice(0, 10);

        map[ds] = {
          date: ds,
          status: "Leave",
          leaveType: l.leaveType, // full | half
        };

        d.setDate(d.getDate() + 1);
      }
    });

    res.json(Object.values(map));
  } catch (err) {
    console.error("❌ CALENDAR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};







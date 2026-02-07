import Employee from "../models/Employee.js";
import AttendanceLog from "../models/AttendanceLog.js";
import Leave from "../models/Leave.js";

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h * 60) + m;
};

const toHHMM = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayAttendance = await AttendanceLog.findOne({
      employee: employeeId,
      date: { $gte: start, $lte: end }
    });

    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const totalDays = await AttendanceLog.countDocuments({
      employee: employeeId,
      date: { $gte: monthStart }
    });

    const presentDays = await AttendanceLog.countDocuments({
      employee: employeeId,
      date: { $gte: monthStart },
      status: "P"
    });

    const monthAttendancePercent =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    res.status(200).json({
      todayStatus: todayAttendance?.status || "A",
      checkIn: todayAttendance?.checkIn || null,
      workingHours: todayAttendance?.workingHours || "0h",
      monthAttendancePercent
    });
  } catch (error) {
    res.status(500).json({ message: "Employee dashboard error" });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().slice(0, 10);

    const companyId = req.user.companyId;

    // 1️⃣ Employees (exclude admins)
    const employees = await Employee.find(
      {
        companyId,
        staffType: "employee",
        isDeleted: { $ne: true }, // 🔥 exclude deleted
      },
      { _id: 1, name: 1 }
    );


    const employeeIds = employees.map(e => e._id);
    const employeeNameMap = {};
    employees.forEach(e => {
      employeeNameMap[e._id.toString()] = e.name;
    });

    const totalEmployees = employeeIds.length;

    // 2️⃣ Present today (distinct employees)
    const presentEmpIds = await AttendanceLog.distinct("empId", {
      companyId,
      date: today,
      empId: { $in: employeeIds }
    });
    const presentToday = presentEmpIds.length;

    // 3️⃣ On leave today
    const onLeave = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      status: "approved",
      fromDate: { $lte: today },
      toDate: { $gte: today }
    });

    // 4️⃣ Pending leaves
    const pendingLeaves = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      status: "pending"
    });

    // 5️⃣ Absent
    const absentToday = Math.max(
      totalEmployees - presentToday - onLeave,
      0
    );

    // 6️⃣ Late check-ins
    const lateEmpIds = await AttendanceLog.distinct("empId", {
      companyId,
      date: today,
      empId: { $in: employeeIds },
      isLate: true
    });
    const lateCheckins = lateEmpIds.length;

    // 7️⃣ Working hours calculations
    const yesterdayAttendance = await AttendanceLog.find({
      companyId,
      date: yesterday,
      empId: { $in: employeeIds },
      workingHours: { $exists: true }
    });

    let totalMinutes = 0;
    let longest = null;
    let shortest = null;

    for (const r of yesterdayAttendance) {
      if (!r.workingHours) continue;

      const [h, m] = r.workingHours.split(":").map(Number);
      const minutes = (h * 60) + m;
      totalMinutes += minutes;

      if (!longest || minutes > longest.minutes) {
        longest = {
          empId: r.empId,
          minutes,
          workingHours: r.workingHours
        };
      }

      if (!shortest || minutes < shortest.minutes) {
        shortest = {
          empId: r.empId,
          minutes,
          workingHours: r.workingHours
        };
      }
    }

    const totalWorkingHoursYesterday =
      totalMinutes > 0
        ? `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`
        : "00:00";

    const uniqueEmployeesYesterday = new Set(
      yesterdayAttendance.map(a => a.empId.toString())
    ).size;

    const averageWorkingHoursYesterday =
      uniqueEmployeesYesterday > 0
        ? `${String(
          Math.floor((totalMinutes / uniqueEmployeesYesterday) / 60)
        ).padStart(2, "0")}:${String(
          Math.floor((totalMinutes / uniqueEmployeesYesterday) % 60)
        ).padStart(2, "0")}`
        : "00:00";


    res.status(200).json({
      totalEmployees,
      presentToday,
      absentToday,
      onLeave,
      pendingLeaves,
      lateCheckins,
      totalWorkingHoursYesterday,
      averageWorkingHoursYesterday,
      longestWorkingEmployee: longest
        ? {
          name: employeeNameMap[longest.empId.toString()],
          workingHours: longest.workingHours
        }
        : null,
      shortestWorkingEmployee: shortest
        ? {
          name: employeeNameMap[shortest.empId.toString()],
          workingHours: shortest.workingHours
        }
        : null
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Admin dashboard error" });
  }
};

export const getMonthlyAttendanceChart = async (req, res) => {
  try {
    const { year, month } = req.query; // month = 1-12

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const matchStage = {
      date: { $gte: startDate, $lte: endDate }
    };

    // If employee → only their data
    if (req.user.role === "EMPLOYEE") {
      matchStage.employee = req.user._id;
    }

    const data = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const chart = {
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0
    };

    data.forEach(item => {
      if (item._id === "P") chart.present = item.count;
      if (item._id === "A") chart.absent = item.count;
      if (item._id === "L") chart.leave = item.count;
      if (item._id === "H") chart.halfDay = item.count;
    });

    res.status(200).json(chart);
  } catch (err) {
    res.status(500).json({ message: "Monthly chart error" });
  }
};


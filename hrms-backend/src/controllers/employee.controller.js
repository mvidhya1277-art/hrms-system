import Employee from "../models/Employee.js";
import AttendanceLog from "../models/AttendanceLog.js";
import Leave from "../models/Leave.js";

// ⚠️ TEMPORARY – remove after use
export const resetEmployeePassword = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    const emp = await Employee.findOne({ phone });
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ✅ set plain password (pre-save hook will hash it)
    emp.password = newPassword;
    await emp.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEmployeeSalary = async (req, res) => {
  try {
    if (!["hr_admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { employeeId } = req.params;
    const { salary } = req.body;

    if (salary === undefined || salary < 0) {
      return res.status(400).json({ message: "Valid salary is required" });
    }

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { salary },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Salary updated successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        empCode: employee.empCode,
        salary: employee.salary,
      },
    });
  } catch (err) {
    console.error("UPDATE SALARY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeListByFilter = async (req, res) => {
  try {
    const { filter } = req.query;
    const companyId = req.user.companyId;

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // 1️⃣ Get all employees
    const employees = await Employee.find({
      companyId,
      staffType: "employee",
    }).select("_id name empCode");

    const employeeIds = employees.map(e => e._id.toString());

    let resultEmployees = [];

    switch (filter) {
      // ✅ ALL ACTIVE
      case "active":
        resultEmployees = employees;
        break;

      // ✅ CHECKED IN TODAY
      case "checkedin": {
        const presentIds = await AttendanceLog.distinct("empId", {
          companyId,
          date: today,
          status: "Present",
        });

        resultEmployees = employees.filter(e =>
          presentIds.map(String).includes(e._id.toString())
        );
        break;
      }

      // ✅ LATE CHECK-INS
      case "late": {
        const lateIds = await AttendanceLog.distinct("empId", {
          companyId,
          date: today,
          isLate: true,
        });

        resultEmployees = employees.filter(e =>
          lateIds.map(String).includes(e._id.toString())
        );
        break;
      }

      // ✅ ON LEAVE TODAY
      case "onleave": {
        const leaveIds = await Leave.distinct("employeeId", {
          status: "approved",
          fromDate: { $lte: today },
          toDate: { $gte: today },
        });

        resultEmployees = employees.filter(e =>
          leaveIds.map(String).includes(e._id.toString())
        );
        break;
      }

      // ✅ ABSENT TODAY
      case "absent": {
        const presentIds = await AttendanceLog.distinct("empId", {
          companyId,
          date: today,
          status: "Present",
        });

        const leaveIds = await Leave.distinct("employeeId", {
          status: "approved",
          fromDate: { $lte: today },
          toDate: { $gte: today },
        });

        resultEmployees = employees.filter(
          e =>
            !presentIds.map(String).includes(e._id.toString()) &&
            !leaveIds.map(String).includes(e._id.toString())
        );
        break;
      }

      default:
        resultEmployees = employees;
    }

    res.status(200).json(resultEmployees);
  } catch (error) {
    console.error("Employee list filter error:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

import Company from "../../models/Company.js";

/**
 * GET Attendance Rules
 * Admin / HR
 */
export const getAttendanceRules = async (req, res) => {
  try {
    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    }).select("attendanceRules officeTimings");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      attendanceRules: company.attendanceRules || {
        gracePeriodMinutes: 0,
        halfDayHours: 4,
        absentHours: 2,
      },
      officeTimings: company.officeTimings,
    });
  } catch (err) {
    console.error("GET ATTENDANCE RULES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE Attendance Rules
 * Admin / HR
 */
export const updateAttendanceRules = async (req, res) => {
  try {
    const {
      gracePeriodMinutes,
      halfDayHours,
      absentHours,
    } = req.body;

    // 🔐 Validation
    if (
      gracePeriodMinutes < 0 ||
      halfDayHours <= 0 ||
      absentHours < 0 ||
      absentHours >= halfDayHours
    ) {
      return res.status(400).json({
        message:
          "Invalid rules: absentHours must be less than halfDayHours",
      });
    }

    const company = await Company.findOneAndUpdate(
      {
        companyId: req.user.companyId,
        isActive: true,
      },
      {
        $set: {
          attendanceRules: {
            gracePeriodMinutes,
            halfDayHours,
            absentHours,
          },
        },
      },
      { new: true }
    ).select("attendanceRules");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      message: "Attendance rules updated successfully",
      attendanceRules: company.attendanceRules,
    });
  } catch (err) {
    console.error("UPDATE ATTENDANCE RULES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

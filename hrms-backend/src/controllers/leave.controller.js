import Leave from "../models/Leave.js";
import getEmployeeId from "../helpers/getEmployeeId.js";

/* EMPLOYEE → APPLY LEAVE */
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;
    const employeeId = await getEmployeeId(req);

    if (!employeeId) {
      return res.status(400).json({ message: "Employee profile not linked" });
    }

    if (!fromDate || !toDate || !reason || !leaveType) {
      return res.status(400).json({ message: "All fields required" });
    }

    const overlappingLeave = await Leave.findOne({
      employeeId,
      status: { $in: ["pending", "approved"] },
      $or: [
        // Same day overlap
        {
          fromDate: fromDate,
          toDate: toDate,
        },
        // Range overlap
        {
          fromDate: { $lte: toDate },
          toDate: { $gte: fromDate },
        },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "Leave already applied for this date",
      });
    }

    const leave = await Leave.create({
      employeeId,
      companyId: req.user.companyId,
      fromDate,
      toDate,
      reason,
      leaveType: leaveType || "full",
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    console.error("APPLY LEAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* EMPLOYEE → VIEW OWN LEAVES */
export const myLeaves = async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req);

    const leaves = await Leave.find({ employeeId }).sort({
      createdAt: -1,
    });

    res.json(leaves);
  } catch (err) {
    console.error("MY LEAVES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ADMIN → VIEW ALL LEAVES */
export const allLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        match: { companyId: req.user.companyId }, // 🔥 FILTER
        select: "name empCode companyId",
      })
      .sort({ createdAt: -1 });

    // Remove nulls caused by populate match
    const filteredLeaves = leaves.filter(l => l.employeeId);

    res.json(filteredLeaves);
  } catch (err) {
    console.error("ALL LEAVES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ADMIN → APPROVE / REJECT */
export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const leave = await Leave.findById(req.params.id);
  if (!leave) {
    return res.status(404).json({ message: "Leave not found" });
  }

  leave.status = status;
  leave.reviewedBy = req.user.id;
  await leave.save();

  res.json({
    message: `Leave ${status}`,
    leave,
  });
};

export const applyLeaveByAdminSelf = async (req, res) => {
  try {
    // ✅ Correct admin check
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Ensure admin is linked to employee
    if (!req.user.employeeId) {
      return res.status(400).json({
        message: "Admin employeeId missing. Cannot apply leave.",
      });
    }

    let { fromDate, toDate, leaveType, reason } = req.body;

    if (!fromDate || !toDate || !leaveType) {
      return res.status(400).json({
        message: "fromDate, toDate and leaveType are required",
      });
    }

    leaveType = leaveType.toLowerCase();

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    const to = new Date(toDate);
    to.setHours(0, 0, 0, 0);

    // 🔒 Overlap check
    const overlappingLeave = await Leave.findOne({
      employeeId: req.user.employeeId,
      status: { $in: ["approved", "pending"] },
      $or: [
        { fromDate: { $lte: to, $gte: from } },
        { toDate: { $lte: to, $gte: from } },
        { fromDate: { $lte: from }, toDate: { $gte: to } },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "Leave already exists for this date range",
      });
    }

    const leave = await Leave.create({
      employeeId: req.user.employeeId,   // 🔥 CORRECT
      fromDate: from,
      toDate: to,
      leaveType,
      reason: reason || "-",
      status: "approved",
      appliedBy: "admin",
      companyId: req.user.companyId,
    });

    res.status(201).json({
      message: "Admin leave applied & approved",
      leave,
    });
  } catch (error) {
    console.error("ADMIN LEAVE ERROR:", error);
    res.status(500).json({
      message: "Admin leave apply failed",
    });
  }
};



 import Leave from "../models/Leave.js";
import getEmployeeId from "../helpers/getEmployeeId.js";

import Company from "../models/Company.js";
import Holiday from "../models/Holiday.js";
import { normalizeDate } from "../utils/normalizeDate.js";
import { isWorkingDay } from "../utils/workingDay.util.js";

export const applyLeave = async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req);
    const { fromDate, toDate, reason, leaveType } = req.body;

    if (!fromDate || !toDate || !reason || !leaveType) {
      return res.status(400).json({ message: "All fields required" });
    }

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    if (!from || !to) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // 🔵 Fetch company
    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 🔵 Fetch holidays
    const holidays = await Holiday.find({
      companyId: req.user.companyId,
      date: { $gte: from, $lte: to },
    }).lean();

    const holidaySet = new Set(holidays.map(h => h.date));

    // 🔵 Build valid leave dates
    const dates = getDateRange(from, to).filter(ds => {
      const d = new Date(ds);
      return isWorkingDay(d, company) && !holidaySet.has(ds);
    });

    if (dates.length === 0) {
      return res.status(400).json({
        message: "Selected dates are non-working days / holidays",
      });
    }

    // 🔒 Overlap check
    const overlappingLeave = await Leave.findOne({
      employeeId,
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: to },
      toDate: { $gte: from },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "Leave already applied for this date range",
      });
    }

    const leave = await Leave.create({
      employeeId,
      companyId: req.user.companyId,
      fromDate: from,
      toDate: to,
      reason,
      leaveType: leaveType.toLowerCase(),
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
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.user.employeeId) {
      return res.status(400).json({
        message: "Admin employeeId missing",
      });
    }

    const { fromDate, toDate, leaveType, reason } = req.body;

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    if (!from || !to) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const overlappingLeave = await Leave.findOne({
      employeeId: req.user.employeeId,
      status: { $in: ["approved", "pending"] },
      fromDate: { $lte: to },
      toDate: { $gte: from },
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "Leave already exists for this date range",
      });
    }

    const leave = await Leave.create({
      employeeId: req.user.employeeId,
      companyId: req.user.companyId,
      fromDate: from,
      toDate: to,
      leaveType: leaveType.toLowerCase(),
      reason: reason || "-",
      status: "approved",
      appliedBy: "admin",
    });

    res.status(201).json({
      message: "Admin leave applied & approved",
      leave,
    });
  } catch (error) {
    console.error("ADMIN LEAVE ERROR:", error);
    res.status(500).json({ message: "Admin leave apply failed" });
  }
};



import Leave from "../../models/Leave.js";
import Employee from "../../models/Employee.js";

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d; // YYYY-MM-DD
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export const getLeaveReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { fromDate, toDate, employeeId, status } = req.query;

    const today = normalizeDate(new Date());
    fromDate = normalizeDate(fromDate) || today;
    toDate = normalizeDate(toDate) || fromDate;

    /* ---------------- EMPLOYEES ---------------- */

    const employeeQuery = {
      companyId,
      staffType: "employee",
    };

    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
    }

    if (employeeId) {
      employeeQuery._id = employeeId;
    }

    const employees = await Employee.find(employeeQuery, {
      _id: 1,
      name: 1,
    });

    // ✅ safeguard
    if (employees.length === 0) {
      return res.json({
        summary: {
          approved: 0,
          pending: 0,
          rejected: 0,
          onLeaveToday: 0,
        },
        records: [],
      });
    }

    const employeeIds = employees.map(e => e._id);
    const employeeMap = {};
    employees.forEach(e => {
      employeeMap[e._id.toString()] = e.name;
    });

    /* ---------------- LEAVE QUERY ---------------- */

    const leaveQuery = {
      companyId,
      employeeId: { $in: employeeIds },
      fromDate: { $lte: toDate },
      toDate: { $gte: fromDate },
    };

    if (status) {
      leaveQuery.status = status;
    }

    const leaves = await Leave.find(leaveQuery).sort({ fromDate: 1 });

    /* ---------------- SUMMARY ---------------- */

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let onLeaveToday = 0;

    leaves.forEach(l => {
      if (l.status === "approved") approved++;
      else if (l.status === "pending") pending++;
      else if (l.status === "rejected") rejected++;

      if (
        l.status === "approved" &&
        normalizeDate(l.fromDate) <= today &&
        normalizeDate(l.toDate) >= today
      ) {
        onLeaveToday++;
      }
    });

    /* ---------------- RECORDS ---------------- */

    const records = leaves.map(l => ({
      employeeId: l.employeeId,
      employeeName: employeeMap[l.employeeId.toString()],
      leaveType: l.leaveType,
      fromDate: normalizeDate(l.fromDate),
      toDate: normalizeDate(l.toDate),
      reason: l.reason || null,
      status: l.status,
      appliedDate: normalizeDate(l.createdAt),
    }));

    /* ---------------- RESPONSE ---------------- */

    res.json({
      filters: {
        fromDate,
        toDate,
        employeeId: employeeId || null,
        status: status || null,
      },
      summary: {
        approved,
        pending,
        rejected,
        onLeaveToday,
      },
      records,
    });

  } catch (err) {
    console.error("LEAVE REPORT ERROR:", err);
    res.status(500).json({ message: "Leave report error" });
  }
};

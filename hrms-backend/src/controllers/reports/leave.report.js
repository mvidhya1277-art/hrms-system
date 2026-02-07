import Leave from "../../models/Leave.js";
import Employee from "../../models/Employee.js";

const normalizeDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && d.length === 10) return d;
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export const getLeaveReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let { fromDate, toDate, employeeId, status } = req.query;

    const todayStr = normalizeDate(new Date());
    fromDate = normalizeDate(fromDate) || todayStr;
    toDate = normalizeDate(toDate) || fromDate;

    /* ---------------- EMPLOYEES ---------------- */
    const employeeQuery = {
      companyId,
      staffType: "employee",
      isDeleted: { $ne: true }, // 🔥 exclude deleted employees
    };

    if (req.user.role === "employee") {
      employeeQuery._id = req.user.employeeId;
    }

    if (employeeId) {
      employeeQuery._id = employeeId;
    }

    const employees = await Employee.find(employeeQuery, { _id: 1, name: 1 });

    if (!employees.length) {
      return res.json({
        summary: { approved: 0, pending: 0, rejected: 0, onLeaveToday: 0 },
        records: [],
      });
    }

    const employeeIds = employees.map(e => e._id);
    const employeeMap = {};
    employees.forEach(e => (employeeMap[e._id.toString()] = e.name));

    /* ---------------- DATE RANGE ---------------- */
    const start = new Date(fromDate + "T00:00:00.000Z");
    const end = new Date(toDate + "T23:59:59.999Z");

    /* ---------------- LEAVE QUERY (mixed safe) ---------------- */
    const leaveQuery = {
      employeeId: { $in: employeeIds },

      $expr: {
        $and: [
          {
            $lte: [
              {
                $cond: [
                  { $eq: [{ $type: "$fromDate" }, "string"] },
                  { $toDate: "$fromDate" },
                  "$fromDate",
                ],
              },
              end,
            ],
          },
          {
            $gte: [
              {
                $cond: [
                  { $eq: [{ $type: "$toDate" }, "string"] },
                  { $toDate: "$toDate" },
                  "$toDate",
                ],
              },
              start,
            ],
          },
        ],
      },
    };


    if (status) leaveQuery.status = status;

    const leaves = await Leave.find(leaveQuery).sort({ createdAt: 1 });

    /* ---------------- SUMMARY ---------------- */
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let onLeaveToday = 0;

    const todayDate = new Date(todayStr + "T00:00:00.000Z");

    leaves.forEach(l => {
      if (l.status === "approved") approved++;
      else if (l.status === "pending") pending++;
      else if (l.status === "rejected") rejected++;

      const lf = new Date(l.fromDate);
      const lt = new Date(l.toDate);

      if (l.status === "approved" && lf <= todayDate && lt >= todayDate) {
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

    res.json({
      filters: { fromDate, toDate, employeeId: employeeId || null, status: status || null },
      summary: { approved, pending, rejected, onLeaveToday },
      records,
    });
  } catch (err) {
    console.error("LEAVE REPORT ERROR:", err);
    res.status(500).json({ message: "Leave report error" });
  }
};

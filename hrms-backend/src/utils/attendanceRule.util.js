import moment from "moment";

export const applyAttendanceRules = ({
  inTime,
  outTime,
  officeStartTime,
  gracePeriodMinutes,
  workingHours,
  halfDayHours,
  absentHours,
}) => {
  let isLate = false;
  let status = "Present";

  // ---------------- LATE CHECK ----------------
  if (inTime) {
    const shiftStart = moment(officeStartTime, "HH:mm");
    const graceEnd = shiftStart.clone().add(gracePeriodMinutes, "minutes");
    const punchIn = moment(inTime, "HH:mm");

    if (punchIn.isAfter(graceEnd)) {
      isLate = true;
    }
  }

  // ---------------- STATUS CHECK ----------------
  if (workingHours < absentHours) {
    status = "absent";
  } else if (workingHours < halfDayHours) {
    status = "halfday";
  } else {
    status = "Present";
  }

  return { status, isLate };
};

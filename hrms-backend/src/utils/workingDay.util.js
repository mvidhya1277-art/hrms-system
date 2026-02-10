import Holiday from "../models/Holiday.js";
import { toLocalDateString } from "./date.util.js";

/**
 * Check if a date is a working day
 */
/**
 * Check if a date is a working day
 */
export const isWorkingDay = (dateObj, company, holidaySet = new Set()) => {
  const day = dateObj.getDay(); // 0 = Sun, 6 = Sat
  const dateStr = toLocalDateString(dateObj);

  if (holidaySet.has(dateStr)) return false;

  if (day === 0) {
    return !company.weekends?.sundayOff;
  }

  if (day === 6) {
    const saturday = company.weekends?.saturday;
    if (!saturday?.enabled) return true;

    const weekOfMonth = Math.ceil(dateObj.getDate() / 7);
    return !saturday.offWeeks.includes(weekOfMonth);
  }

  return true;
};



/**
 * Get all working days in a month
 */
export const getWorkingDaysInMonth = async (
    year,
    month,
    company
) => {
    const daysInMonth = new Date(year, month, 0).getDate();

    // 🔵 Fetch holidays once
    const holidayDocs = await Holiday.find({
        companyId: company.companyId,
    }).lean();

    const holidaySet = new Set(holidayDocs.map(h => h.date));

    const workingDays = [];

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month - 1, d);
        const dateStr = dateObj.toISOString().slice(0, 10);

        if (isWorkingDay(dateObj, company, holidaySet)) {
            workingDays.push(dateStr);
        }
    }

    return workingDays; // ["YYYY-MM-DD"]
};

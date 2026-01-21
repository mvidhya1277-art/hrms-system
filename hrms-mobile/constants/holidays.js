

export const GENERAL_HOLIDAYS = {
  2025: {
    "2025-01-01": "New Year",
    "2025-01-26": "Republic Day",
    "2025-08-15": "Independence Day",
    "2025-10-02": "Gandhi Jayanthi",
    "2025-12-25": "Christmas",
  },
  2026: {
    "2026-01-01": "New Year",
    "2026-01-14":"Pongal",
    "2026-01-26": "Republic Day",
  },
};

export const isSunday = (date) => date.getDay() === 0;

export const isEvenSaturday = (date) => {
  if (date.getDay() !== 6) return false; // not Saturday

  const day = date.getDate();
  const weekOfMonth = Math.ceil(day / 7);

  // 2nd and 4th Saturdays
  return weekOfMonth === 2 || weekOfMonth === 4;
};

export const getHolidayName = (dateStr) => {
  const year = new Date(dateStr).getFullYear();
  return GENERAL_HOLIDAYS[year]?.[dateStr] || null;
};

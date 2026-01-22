import { View, Text, ActivityIndicator, Button } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import { useAuthStore } from "../../../../store/authStore";
import { API_BASE_URL } from "../../../../constants/api";
import {
  isSunday,
  isEvenSaturday,
  getHolidayName,
} from "../../../../constants/holidays";

export default function EmployeeCalendar({ employeeId, employeeName }) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams();
  const routeEmployeeId = params?.employeeId;
  const targetEmployeeId = routeEmployeeId || employeeId;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  /* ---------------- HELPERS ---------------- */

  const normalize = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const isFutureDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr + "T00:00:00") > today;
  };

  // 🔥 SINGLE SOURCE OF TRUTH (ADMIN + EMPLOYEE LEAVE)
  const getLeaveOnDate = (data, date) => {
    // Admin leave (range)
    const rangeLeave = data.find((l) => {
      if (!l.fromDate || !l.toDate) return false;
      const from = normalize(l.fromDate);
      const to = normalize(l.toDate);
      return date >= from && date <= to;
    });

    if (rangeLeave) return rangeLeave;

    // Employee leave (single day)
    const dateStr = date.toISOString().slice(0, 10);
    const singleLeave = data.find(
      (r) => r.date === dateStr && r.status === "Leave"
    );

    return singleLeave || null;
  };

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    setMarkedDates({});
    setAttendanceData([]);
    setSelectedDate(null);
    setDayDetails(null);
    fetchCalendar(currentMonth.year, currentMonth.month);
  }, [routeEmployeeId, currentMonth.year, currentMonth.month]);

  const fetchCalendar = async (year, month) => {
    try {
      setLoading(true);

      const url = targetEmployeeId
        ? `${API_BASE_URL}/attendance/attendance-leave/${targetEmployeeId}`
        : `${API_BASE_URL}/attendance/attendance-leave`;

      const res = await axios.get(url, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setAttendanceData(data);
      buildCalendarMarks(data, year, month);
    } catch (err) {
      console.error("Calendar error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CALENDAR MARKING ---------------- */

  const buildCalendarMarks = (data, year, month) => {
    const marks = {};
    const todayStr = new Date().toISOString().slice(0, 10);

    const recordMap = {};
    data.forEach((r) => {
      if (r.date) recordMap[r.date] = r;
    });

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      date.setHours(0, 0, 0, 0);

      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      if (dateStr > todayStr) continue;

      const rec = recordMap[dateStr];
      const leave = getLeaveOnDate(data, date);

      if (leave && leave.leaveType === "half") {
        marks[dateStr] = { selected: true, selectedColor: "#facc15" };
        continue;
      }

      if (leave) {
        marks[dateStr] = { selected: true, selectedColor: "#ef4444" };
        continue;
      }

      if (getHolidayName(dateStr) || isSunday(date) || isEvenSaturday(date)) {
        marks[dateStr] = { selected: true, selectedColor: "#3b82f6" };
        continue;
      }

      if (rec && rec.status === "Present") {
        marks[dateStr] = { selected: true, selectedColor: "#22c55e" };
      } else {
        marks[dateStr] = { selected: true, selectedColor: "#9ca3af" };
      }
    }

    setMarkedDates({ ...marks });
  };

  /* ---------------- DAY PRESS ---------------- */

  const handleDayPress = (day) => {
    const dateStr = day.dateString;

    if (isFutureDate(dateStr)) {
      setSelectedDate(dateStr);
      setDayDetails({
        type: "info",
        label: "Future date — attendance not available",
      });
      return;
    }

    const date = new Date(dateStr + "T00:00:00");
    setSelectedDate(dateStr);

    const holiday = getHolidayName(dateStr);
    if (holiday) return setDayDetails({ type: "holiday", label: holiday });
    if (isSunday(date))
      return setDayDetails({
        type: "holiday",
        label: "Weekly Holiday (Sunday)",
      });
    if (isEvenSaturday(date))
      return setDayDetails({
        type: "holiday",
        label: "Weekly Holiday (Saturday)",
      });

    const leave = getLeaveOnDate(attendanceData, date);
    if (leave) return setDayDetails(leave);

    const record = attendanceData.find((r) => r.date === dateStr);
    setDayDetails(record || null);
  };

  /* ---------------- MONTHLY SUMMARY ---------------- */

  const getMonthlySummary = () => {
    let present = 0,
      leave = 0,
      half = 0,
      absent = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = currentMonth.year;
    const monthIndex = currentMonth.month - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const recordMap = {};
    attendanceData.forEach((r) => {
      if (r.date) recordMap[r.date] = r;
    });

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, monthIndex, d);
      date.setHours(0, 0, 0, 0);

      const dateStr = `${year}-${String(currentMonth.month).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;

      if (
        date > today ||
        isSunday(date) ||
        isEvenSaturday(date) ||
        getHolidayName(dateStr)
      )
        continue;

      const rec = recordMap[dateStr];
      const leaveRec = getLeaveOnDate(attendanceData, date);

      if (leaveRec && leaveRec.leaveType === "half") half++;
      else if (leaveRec) leave++;
      else if (rec && rec.status === "Present") present++;
      else absent++;
    }

    return { present, leave, half, absent };
  };

  const summary = getMonthlySummary();

  /* ---------------- UI ---------------- *///bulk

  return (
    <View style={{ flex: 1, padding: 16 }}>

      <Text style={{ fontSize: 18, marginBottom: 6 }}>
        {employeeName} Attendance
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Text style={{ marginRight: 15 }}>🟢 Present</Text>
        <Text style={{ marginRight: 15 }}>🔴 Leave</Text>
        <Text style={{ marginRight: 15 }}>🟡 Half</Text>
        <Text>🔘 Absent</Text>
      </View>

      <Calendar
        markedDates={markedDates}
        enableSwipeMonths
        onDayPress={handleDayPress}
        onMonthChange={(month) => {
          setSelectedDate(null);
          setDayDetails(null);
          setCurrentMonth({ year: month.year, month: month.month });
        }}
      />

      {loading && <ActivityIndicator size="small" style={{ marginTop: 10 }} />}

      {selectedDate && (
        <View style={{ marginTop: 15, padding: 12, borderWidth: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{selectedDate}</Text>
          {dayDetails?.type === "holiday" && (
            <Text>Holiday: {dayDetails.label}</Text>
          )}
          {dayDetails?.type === "info" && <Text>{dayDetails.label}</Text>}
          {dayDetails && !dayDetails.type && (
            <Text>Status: {dayDetails.status}</Text>
          )}
          {!dayDetails && <Text>Absent</Text>}
        </View>
      )}

      <View style={{ marginTop: 20, padding: 12, backgroundColor: "#f3f4f6" }}>
        <Text style={{ fontWeight: "bold" }}>Monthly Summary</Text>
        <Text>🟢 Present: {summary.present}</Text>
        <Text>🔴 Leave: {summary.leave}</Text>
        <Text>🟡 Half: {summary.half}</Text>
        <Text>🔘 Absent: {summary.absent}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          title="View Payroll"
          onPress={() =>
            router.push({
              pathname: "tabs/employees/payroll",
              params: { employeeId: targetEmployeeId, employeeName },
            })
          }
        />
      </View>
    </View>
  );
}



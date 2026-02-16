import { View, Text, ActivityIndicator, Button, StyleSheet, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import { useAuthStore } from "../../../../store/authStore";
import { API_BASE_URL } from "../../../../constants/api";


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
  const myEmployeeId = useAuthStore(s => s.employeeId);
  // const targetEmployeeId = routeEmployeeId || employeeId;
  const targetEmployeeId =
    routeEmployeeId || employeeId || myEmployeeId;

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
    if (!token) return; 
    setMarkedDates({});
    setAttendanceData([]);
    setSelectedDate(null);
    setDayDetails(null);
    fetchCalendar(currentMonth.year, currentMonth.month);
  }, [routeEmployeeId, currentMonth.year, currentMonth.month]);

  const fetchCalendar = async (year, month) => {
      if (!token) return;
    try {
      setLoading(true);

      const url = targetEmployeeId
        ? `${API_BASE_URL}/attendance/attendance-leave/${targetEmployeeId}`
        : `${API_BASE_URL}/attendance/attendance-leave`;

      const res = await axios.get(url, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("TOKEN USED:", token);
         
      const data = Array.isArray(res.data) ? res.data : [];
      setAttendanceData(data);
      buildCalendarMarks(data, year, month);
    } catch (err) {
      console.error("Calendar error:", err.response?.data || err.message);
    } finally {
      setLoading(false);//sundayv weekends
    }
  };


  const buildCalendarMarks = (data) => {
    const marks = {};
    const todayStr = new Date().toISOString().slice(0, 10);

    data.forEach((rec) => {
      if (!rec.date || rec.date > todayStr) return;

      let color = "#9ca3af"; // Absent

      if (rec.status === "Present") {
        color = "#22c55e";
      }
      else if (rec.status === "Leave") {
        const leaveType = (rec.leaveType || "").toLowerCase();
        color = leaveType === "half" ? "#facc15" : "#ef4444";
      }
      else if (rec.status === "Weekly Off" || rec.status === "Holiday") {
        color = "#3b82f6";//todayStr
      }

      marks[rec.date] = {
        customStyles: {
          container: {
            backgroundColor: color,
            borderRadius: 10,
          },
          text: {
            color: "#fff",
            fontWeight: "700",
          },
        },
      };
    });

    setMarkedDates(marks);
  };




const handleDayPress = (day) => {

  const record = attendanceData.find(
    (r) => r.date === day.dateString
  );

  console.log("🔍 FOUND RECORD:", record);

  setSelectedDate(day.dateString);
  setDayDetails(record || { status: "Absent" });
};

  /* ---------------- MONTHLY SUMMARY ---------------- */

  const getMonthlySummary = () => {
    let present = 0, leave = 0, half = 0, absent = 0;

    attendanceData.forEach((r) => {
      if (r.status === "Weekly Off" || r.status === "Holiday") return;

      if (r.status === "Present") present++;
      else if (r.status === "Leave" && r.leaveType === "half") half++;
      else if (r.status === "Leave") leave++;
      else if (r.status === "Absent") absent++;
    });

    return { present, leave, half, absent };
  };



  const summary = getMonthlySummary();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>

        <Text style={styles.title}>My Attendance</Text>
        <Text style={styles.subtitle}>Attendance Tracking</Text>

        {/* Summary cards */}
        <View style={styles.cardRow}>
          <View style={[styles.statCard, { borderTopColor: "#22c55e", borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{summary.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#ef4444", borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{summary.leave}</Text>
            <Text style={styles.statLabel}>Leave</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#facc15", borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{summary.half}</Text>
            <Text style={styles.statLabel}>Half Day</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: "#b3abab", borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{summary.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            enableSwipeMonths
            markingType="custom"
            theme={{
              todayTextColor: "#ef4444",
              textDayFontWeight: "600",
              textMonthFontWeight: "700",
              arrowColor: "#ef4444",
            }}
            onDayPress={handleDayPress}
            onMonthChange={(month) => {
              setSelectedDate(null);
              setDayDetails(null);
              setCurrentMonth({ year: month.year, month: month.month });
            }}
          />

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#22c55e" }]} />
              <Text>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
              <Text>Holiday</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#facc15" }]} />
              <Text>Half Day</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
              <Text> Leave</Text>
            </View>
          </View>
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

        {selectedDate && (
          <View style={styles.detailBox}>
            <Text style={styles.detailDate}>{selectedDate}</Text>
            <Text>Status: {dayDetails?.status || dayDetails?.label || "Absent"}</Text>
          </View>
        )}

        {/* Payroll Button */}
        <Pressable
          style={styles.payrollBtn}
          onPress={() =>
            router.push({
              pathname: "/(admin-tabs)/tabs/employees/payroll",
              params: {
                employeeId: targetEmployeeId,
                employeeName: employeeName || "My",
              },
            })
          }
        >
          <Text style={styles.payrollText}>VIEW PAYROLL</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 2,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statCard: {
    width: "23%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
  },

  /* calendar */
  calendarCard: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    elevation: 4,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 4,
  },

  /* detail box */
  detailBox: {
    marginTop: 8,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detailDate: {
    fontWeight: "700",
    marginBottom: 4,
  },

  /* compact summary */
  compactSummary: {
    marginTop: 12,
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  compactTitle: {
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 2,
  },
  compactText: {
    fontSize: 14,
    letterSpacing: 1,
  },

  /* button */
  payrollBtn: {
    marginTop: 16,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  payrollText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});




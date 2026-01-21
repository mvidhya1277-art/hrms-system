import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../constants/api";
import { GENERAL_HOLIDAYS } from "../../constants/holidays";

export default function AttendanceCalendar({ employeeId }) {
  const { token } = useAuthStore();

  const [markedDates, setMarkedDates] = useState({});
  const [timelineMap, setTimelineMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTimeline = async () => {
    const url = employeeId
      ? `${API_BASE_URL}/reports/attendance-leave/${employeeId}`
      : `${API_BASE_URL}/reports/attendance-leave`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/reports/attendance-leave`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const marks = {};
      const map = {};

      /* 1️⃣ LEAVES + PRESENT (HIGHEST PRIORITY) */
      res.data.forEach((item) => {
        console.log("CALENDAR ITEM:", item);

        map[item.date] = item;

        if (item.status === "Leave" && item.leaveType === "half") {
          marks[item.date] = {
            selected: true,
            selectedColor: "#dfb67aff", // 🟠 Half Day
          };
        } else if (item.status === "Leave") {
          marks[item.date] = {
            selected: true,
            selectedColor: "#49b7c5ff", // 🔴 Full Day
          };
        } else {
          marks[item.date] = {
            selected: true,
            selectedColor: "#71b173ff", // 🟢 Present
          };
        }
      });

      /* 2️⃣ HOLIDAYS (ONLY IF NOT ALREADY MARKED) */
      Object.keys(GENERAL_HOLIDAYS).forEach((date) => {
        if (!marks[date]) {
          marks[date] = {
            selected: true,
            selectedColor: "#2196F3", // 🔵 Holiday
          };
          map[date] = {
            status: "Holiday",
            reason: HOLIDAYS[date],
          };
        }
      });

      /* 3️⃣ ABSENT (LOWEST PRIORITY) */
      const today = new Date().toISOString().slice(0, 10);
      const current = new Date(today);
      current.setDate(1);

      while (current.getMonth() === new Date(today).getMonth()) {
        const date = current.toISOString().slice(0, 10);

        if (date < today && !marks[date]) {
          marks[date] = {
            selected: true,
            selectedColor: "#e47f7dff", // 🟡 Absent
          };
          map[date] = { status: "Absent" };
        }

        current.setDate(current.getDate() + 1);
      }

      setMarkedDates(marks);
      setTimelineMap(map);
    } catch (err) {
      console.log("Calendar fetch error", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const selectedData = selectedDate ? timelineMap[selectedDate] : null;

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Attendance Calendar
      </Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      {/* LEGEND */}
      <View style={{ marginTop: 15 }}>
        {/* Present */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#71b173ff",
              marginRight: 8,
            }}
          />
          <Text>Present</Text>
        </View>

        {/* Leave */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e47f7dff",
              marginRight: 8,
            }}
          />
          <Text>Leave</Text>
        </View>
      </View>

      {/* MODAL */}
      <Modal
        visible={!!selectedDate}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDate(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              📅 {selectedDate}
            </Text>

            {selectedData ? (
              selectedData.status === "Present" ? (
                <>
                  <Text style={{ fontSize: 16 }}>🟢 Present</Text>
                  <Text>🕘 In: {selectedData.inTime || "-"}</Text>
                  <Text>🕕 Out: {selectedData.outTime || "-"}</Text>
                </>
              ) : selectedData.status === "Absent" ? (
                <>
                  <Text style={{ fontSize: 16 }}>🟡 Absent</Text>
                  <Text>No attendance recorded</Text>
                </>
              ) : selectedData.status === "Leave" ? (
                <>
                  <Text style={{ fontSize: 16 }}>
                    {selectedData.leaveType === "half"
                      ? "🟠 Half Day Leave"
                      : "🔴 Full Day Leave"}
                  </Text>
                  <Text>📝 Reason: {selectedData.reason}</Text>
                </>
              ) : selectedData.status === "Holiday" ? (
                <>
                  <Text style={{ fontSize: 16 }}>🔵 Holiday</Text>
                  <Text>🎉 {selectedData.reason}</Text>
                </>
              ) : (
                <Text>⚪ No record</Text>
              )
            ) : (
              <Text>⚪ No record</Text>
            )}

            <TouchableOpacity
              onPress={() => setSelectedDate(null)}
              style={{
                marginTop: 20,
                backgroundColor: "#2196F3",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


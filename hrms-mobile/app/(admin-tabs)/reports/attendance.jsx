import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import DateTimePicker from "@react-native-community/datetimepicker";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function AttendanceReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

  const [mode, setMode] = useState("monthly"); // daily | monthly//getDateRange
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );//dateText use

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [month, selectedDate, mode]); // ✅ re-fetch on month change summary


  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/reports/attendance`, {
        params:
          mode === "daily"
            ? { type: "daily", date: selectedDate }
            : { type: "monthly", month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const summary = res.data.summary;

      setStats({
        present: summary.avgPresent || 0,
        absent: summary.avgAbsent || 0,
        late: summary.avgLate || 0,
      });

    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const chartData = [
    { name: "Present", population: stats.present, color: "#22C55E", legendFontColor: "#374151" },
    { name: "Absent", population: stats.absent, color: "#EF4444", legendFontColor: "#374151" },
    { name: "Late", population: stats.late, color: "#F59E0B", legendFontColor: "#374151" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>Attendance Report</Text>
        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.togglePill, mode === "daily" && styles.toggleActive]}
            onPress={() => setMode("daily")}
          >
            <Text style={[styles.toggleText, mode === "daily" && styles.toggleTextActive]}>
              Daily
            </Text>
          </Pressable>

          <Pressable
            style={[styles.togglePill, mode === "monthly" && styles.toggleActive]}
            onPress={() => setMode("monthly")}
          >
            <Text style={[styles.toggleText, mode === "monthly" && styles.toggleTextActive]}>
              Monthly
            </Text>
          </Pressable>
        </View>

        {mode === "monthly" ? (
          <MonthPicker month={month} onChange={setMonth} />
        ) : (
          <>
            <Pressable style={styles.dateCard} onPress={() => setShowPicker(true)}>
              <View style={styles.dateIconWrap}>
                <Text style={styles.dateIcon}>📅</Text>
              </View>

              <View>
                <Text style={styles.dateMain}>
                  {new Date(selectedDate).toDateString()}
                </Text>
                <Text style={styles.dateSub}>Tap to change date</Text>
              </View>
            </Pressable>


            {showPicker && (
              <DateTimePicker
                value={new Date(selectedDate)}
                mode="date"
                display="default"
                onChange={(e, d) => {
                  setShowPicker(false);
                  if (d) setSelectedDate(d.toISOString().slice(0, 10));
                }}
              />
            )}
          </>
        )}



        {/* ✅ MONTH PICKER
        <MonthPicker month={month} onChange={setMonth} /> */}

        {/* Summary Cards */}
        <View style={styles.listContainer}>
          <Card label="Avg Present days" value={stats.present} status="present" />
          <Card label="Avg Absent days" value={stats.absent} status="absent" />
          <Card label="Avg Late days" value={stats.late} status="late" />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="12"
            absolute
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- CARD ---------- */

const Card = ({ label, value, status }) => {
  const map = {
    present: { bg: "#DCFCE7", border: "#22C55E", text: "✓", index: "1" },
    absent: { bg: "#FEE2E2", border: "#EF4444", text: "✗", index: "2" },
    late: { bg: "#FEF3C7", border: "#F59E0B", text: "…", index: "3" },
  };

  const s = map[status];

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.checkbox, { backgroundColor: s.bg, borderColor: s.border }]}>
          <Text style={styles.checkboxText}>{s.text}</Text>
        </View>
        <Text style={styles.cardLabel}>({s.index}) {label}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F7FB" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  listContainer: { marginBottom: 24 },
  chartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 30,
    padding: 4,
    marginBottom: 12,
  },

  togglePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: "center",
  },

  toggleActive: {
    backgroundColor: "#2563EB",
  },

  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  toggleTextActive: {
    color: "#FFFFFF",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2563EB",
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  dateIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  dateIcon: {
    fontSize: 22,
    color: "#FFFFFF",
  },

  dateMain: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  dateSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  checkboxText: { fontWeight: "700" },
  cardLabel: { fontSize: 16, fontWeight: "600" },
  cardValue: { fontSize: 20, fontWeight: "700" },
});




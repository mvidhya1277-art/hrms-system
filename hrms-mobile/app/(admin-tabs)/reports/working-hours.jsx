import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";
import { Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function WorkingHoursReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showPicker, setShowPicker] = useState(false);


  // const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [mode, setMode] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [summary, setSummary] = useState({
    totalEmployeesWorked: 0,
    avgDaysWorked: 0,
    averageWorkingHours: 0,
    avgLateArrivals: 0,
  });


  useEffect(() => {
    fetchWorkingHours();
  }, [month, selectedDate, mode]);

  const getDateRange = (month) => {
    const [y, m] = month.split("-");
    const start = `${y}-${m}-01`;
    const end = `${y}-${m}-${new Date(y, m, 0).getDate()}`;
    return { start, end };
  };

  const fetchWorkingHours = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/reports/working-hours`,
        {
          params:
            mode === "daily"
              ? { type: "daily", date: selectedDate }
              : { type: "monthly", month },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSummary(res.data.summary);
    } catch (err) {
      console.error("Working hours fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const chartData = {
    labels: ["Average Working Hours"],
    datasets: [{ data: [summary.averageWorkingHours] }],
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const formatPrettyDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>Working Hours Report</Text>

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
              <View style={styles.dateIconCircle}>
                <Text style={styles.dateIcon}>📅</Text>
              </View>

              <View>
                <Text style={styles.dateMainText}>
                  {formatPrettyDate(selectedDate)}
                </Text>
                <Text style={styles.dateSubText}>
                  Tap to change date
                </Text>
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

        {/* ✅ MONTH PICKER */}
        {/* <MonthPicker month={month} onChange={setMonth} /> */}

        {/* Checkbox Style Cards */}
        <View style={styles.listContainer}>
          <Card
            label="Avg Days Worked"
            value={summary.avgDaysWorked}
            status="days"
            number={1}
          />

          <Card
            label="Avg Hours / Day"
            value={`${summary.averageWorkingHours}h`}
            status="hours"
            number={2}
          />

          <Card
            label="Avg Late Arrivals "
            value={summary.avgLateArrivals}
            status="late"
            number={3}
          />

        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={240}
            yAxisSuffix="h"
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- CARD ---------- */

const Card = ({ label, value, status, number }) => {
  const getCheckboxStyle = () => {
    switch (status) {
      case "days":
        return [styles.checkbox, styles.checkboxDays];
      case "hours":
        return [styles.checkbox, styles.checkboxHours];
      case "late":
        return [styles.checkbox, styles.checkboxLate];
      default:
        return [styles.checkbox];
    }
  };

  const getCheckboxText = () => {
    switch (status) {
      case "days":
        return "📅";
      case "hours":
        return "⏰";
      case "late":
        return "⏱️";
      default:
        return "";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={getCheckboxStyle()}>
          <Text style={styles.checkboxText}>{getCheckboxText()}</Text>
        </View>
        <Text style={styles.cardLabel}>({number}) {label}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FB",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1F2937",
  },
  listContainer: {
    marginBottom: 28,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDays: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  checkboxHours: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  checkboxLate: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  checkboxText: {
    fontSize: 12,
    color: "#1F2937",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  }, toggleRow: {
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
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    elevation: 2,
  },

  dateIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  dateIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },

  dateMainText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  dateSubText: {
    fontSize: 12,
    color: "#6B7280",
  },


});


import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function PerformanceReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [summary, setSummary] = useState({
    top: 0,
    average: 0,
    needsSupport: 0,
  });

  const [mode, setMode] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchPerformance();
  }, [month, selectedDate, mode]); // ✅ refetch on month change

  const fetchPerformance = async () => {
    try {
      setLoading(true); // ✅ reset loader

      const res = await axios.get(
        `${API_BASE_URL}/reports/performance`,
        {
          params:
            mode === "daily"
              ? { type: "daily", date: selectedDate }
              : { type: "monthly", month }, // ✅ send month
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);

    } catch (err) {
      console.error("Performance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Top", "Average", "Needs Support"],
    datasets: [{ data: [summary.top, summary.average, summary.needsSupport] }],
  };

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

        <Text style={styles.title}>Performance Report</Text>

        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.togglePill, mode === "daily" && styles.toggleActive]}
            onPress={() => {
              setMode("daily");
              setShowPicker(false);   // 👈 close picker
            }}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "daily" && styles.toggleTextActive,
              ]}
            >
              Daily
            </Text>
          </Pressable>

          <Pressable
            style={[styles.togglePill, mode === "monthly" && styles.toggleActive]}
            onPress={() => {
              setMode("monthly");
              setShowPicker(false);   // 👈 close picker
            }}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "monthly" && styles.toggleTextActive,
              ]}
            >
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
                  {new Date(selectedDate).toDateString()}
                </Text>
                <Text style={styles.dateSubText}>Tap to change date</Text>
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


        {/* Checkbox Style Cards */}
        <View style={styles.listContainer}>
          <Card label="Top Performers" value={summary.top} status="top" number={1} />
          <Card label="Average Performers" value={summary.average} status="average" number={2} />
          <Card label="Needs Support" value={summary.needsSupport} status="support" number={3} />
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={240}
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
      case "top":
        return [styles.checkbox, styles.checkboxTop];
      case "average":
        return [styles.checkbox, styles.checkboxAverage];
      case "support":
        return [styles.checkbox, styles.checkboxSupport];
      default:
        return [styles.checkbox];
    }
  };

  const getCheckboxText = () => {
    switch (status) {
      case "top":
        return "⭐";
      case "average":
        return "📊";
      case "support":
        return "🔄";
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
  checkboxTop: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  checkboxAverage: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  checkboxSupport: {
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

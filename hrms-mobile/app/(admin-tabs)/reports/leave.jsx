import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function LeaveReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const getDateRange = (month) => {
    const [y, m] = month.split("-");
    return {
      start: `${y}-${m}-01`,
      end: `${y}-${m}-${new Date(y, m, 0).getDate()}`,
    };
  };

  useEffect(() => {
    fetchLeaves();
  }, [month]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(month);

      const res = await axios.get(`${API_BASE_URL}/reports/leave`, {
        params: { fromDate: start, toDate: end },
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data.summary);
    } catch (err) {
      console.error("Leave report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { name: "Approved", population: stats.approved, color: "#22C55E", legendFontColor: "#374151" },
    { name: "Pending", population: stats.pending, color: "#F59E0B", legendFontColor: "#374151" },
    { name: "Rejected", population: stats.rejected, color: "#EF4444", legendFontColor: "#374151" },
  ];

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>Leave Report</Text>
        <MonthPicker month={month} onChange={setMonth} />

        <View style={styles.listContainer}>
          <Card label="Approved" value={stats.approved} status="approved" number={1} />
          <Card label="Pending" value={stats.pending} status="pending" number={2} />
          <Card label="Rejected" value={stats.rejected} status="rejected" number={3} />
        </View>

        {/* <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            absolute
          />
        </View> */}

        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            hasLegend={false}   // ❌ remove built-in labels
            center={[(screenWidth - 32) / 4, 0]}
            paddingLeft="0"
            absolute
          />

          {/* Custom Legend */}
          <View style={styles.legendContainer}>
            {data.map((item, i) => (
              <View key={i} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.population} {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const Card = ({ label, value, status, number }) => {
  // Get checkbox style based on status
  const getCheckboxStyle = () => {
    switch (status) {
      case 'approved':
        return [styles.checkbox, styles.checkboxApproved];
      case 'pending':
        return [styles.checkbox, styles.checkboxPending];
      case 'rejected':
        return [styles.checkbox, styles.checkboxRejected];
      default:
        return [styles.checkbox];
    }
  };

  // Get checkbox text based on status
  const getCheckboxText = () => {
    switch (status) {
      case 'approved':
        return "✓";
      case 'rejected':
        return "✗";
      case 'pending':
        return "…";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FB"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1F2937"
  },
  listContainer: {
    marginBottom: 28
  },
  legendContainer: {
    marginTop: 16,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  legendText: {
    fontSize: 14,
    color: "#374151",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxApproved: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  checkboxPending: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  checkboxRejected: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#1F2937"
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: "#374151"
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: "#1F2937"
  }
});
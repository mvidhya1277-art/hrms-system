import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackedBarChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import axios from "axios";

import { chartConfig, screenWidth } from "../../../constants/chartConfig";
import { API_BASE_URL } from "../../../constants/api";
import { useAuthStore } from "../../../store/authStore";
import MonthPicker from "../../../components/MonthPicker";

export default function PayrollReport() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [summary, setSummary] = useState({
    totalBasicSalary: 0,
    totalDeductions: 0,
    totalPayout: 0,
  });

  useEffect(() => {
    fetchPayroll();
  }, [month]);

  const fetchPayroll = async () => {
    try {
      setLoading(true); // ✅ IMPORTANT FIX

      const res = await axios.get(
        `${API_BASE_URL}/reports/payroll`,
        {
          params: { month },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data.summary);

    } catch (err) {
      console.error("Payroll report fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // const chartData = {
  //   labels: ["Salary"],
  //   legend: ["Basic Salary", "Deductions"],
  //   data: [[summary.totalBasicSalary, summary.totalDeductions]],
  //   barColors: ["#22C55E", "#EF4444"],
  // };

  const chartData = {
    labels: ["Salary"],
    legend: ["Net Pay", "Deductions"],
    data: [[summary.totalPayout, summary.totalDeductions]],
    barColors: ["#22C55E", "#EF4444"],
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

        <Text style={styles.title}>Payroll Report</Text>

        {/* ✅ MONTH PICKER */}
        <MonthPicker month={month} onChange={setMonth} />

        {/* Summary Cards */}
        <View style={styles.listContainer}>
          <Card label="Basic Salary" value={`₹${summary.totalBasicSalary}`} status="salary" number={1} />
          <Card label="Deductions" value={`₹${summary.totalDeductions}`} status="deductions" number={2} />
          <Card label="Net Pay" value={`₹${summary.totalPayout}`} status="netpay" number={3} />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <StackedBarChart
            data={chartData}
            width={screenWidth - 32}
            height={260}
            chartConfig={{
              ...chartConfig,
              formatYLabel: (v) => `₹${Math.round(v / 1000)}k`,
            }}
            segments={5}
            yAxisInterval={1}
            hideLegend={true}   // 🔴 turn off default legend
            decimalPlaces={0}
          />

          {/* Custom Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
              <Text style={styles.legendText}>Basic Salary</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.legendText}>Deductions</Text>
            </View>
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
      case 'salary':
        return [styles.checkbox, styles.checkboxSalary];
      case 'deductions':
        return [styles.checkbox, styles.checkboxDeductions];
      case 'netpay':
        return [styles.checkbox, styles.checkboxNetPay];
      default:
        return [styles.checkbox];
    }
  };

  // Get checkbox text based on status
  const getCheckboxText = () => {
    switch (status) {
      case 'salary':
        return "₹";
      case 'deductions':
        return "-";
      case 'netpay':
        return "=";
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
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
  checkboxSalary: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  checkboxDeductions: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  checkboxNetPay: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  checkboxText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#1F2937"
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: "#374151"
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: "#1F2937"
  }
});
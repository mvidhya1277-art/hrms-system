import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Payslip() {
  const { payrollId } = useLocalSearchParams();
  const { token } = useAuthStore();

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslip();
  }, []);

  const fetchPayslip = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payslip/${payrollId}/payslip`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayslip(res.data);
    } catch (err) {
      console.log("PAYSLIP ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!payslip) return <Text>No payslip found</Text>;

  const { employee, company, salary, attendance } = payslip;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView
        style={styles.page}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // 🔥 IMPORTANT
      >
        {/* ================= HEADER ================= */}
        <LinearGradient
          colors={["#2c3e50", "#34495e"]}
          style={styles.headerCard}
        >
          <Text style={styles.headerTitle}>Employee Payslip</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Employee</Text>
              <Text style={styles.value}>{employee.name}</Text>
            </View>
            <View>
              <Text style={styles.label}>Employee ID</Text>
              <Text style={styles.value}>{employee.empCode}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Month</Text>
              <Text style={styles.value}>{company.month}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ================= ATTENDANCE ================= */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Summary</Text>

          <Row label="Total Working Days" value={attendance.totalWorkingDays} />
          <Row label="Present Days" value={attendance.presentDays} />
          <Row label="Leave Days" value={attendance.leaveDays} />
          <Row label="Half Days" value={attendance.halfDays} />
          <Row label="Absent Days" value={attendance.absentDays} />
        </View>

        {/* ================= EARNINGS ================= */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings</Text>

          <Row
            label="Basic Salary"
            value={`₹${salary.basicSalary.toLocaleString("en-IN")}`}
          />
        </View>

        {/* ================= DEDUCTIONS ================= */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deductions</Text>

          <Row
            label="Attendance / LOP Deduction"
            value={`₹${salary.attendanceDeduction.toLocaleString("en-IN")}`}
          />

          {salary.pf > 0 && (
            <Row
              label="Provident Fund (PF)"
              value={`₹${salary.pf.toLocaleString("en-IN")}`}
            />
          )}

          {salary.esi > 0 && (
            <Row
              label="ESI"
              value={`₹${salary.esi.toLocaleString("en-IN")}`}
            />
          )}

          {salary.professionalTax > 0 && (
            <Row
              label="Professional Tax"
              value={`₹${salary.professionalTax.toLocaleString("en-IN")}`}
            />
          )}

          <View style={styles.divider} />

          <Row
            label="Total Deductions"
            value={`₹${salary.totalDeductions.toLocaleString("en-IN")}`}
            danger
          />
        </View>

        {/* ================= NET PAY ================= */}
        <View style={styles.netCard}>
          <Text style={styles.netLabel}>Net Salary Payable</Text>
          <Text style={styles.netAmount}>
            ₹{salary.netSalary.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* ================= DOWNLOAD ================= */}
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() =>
            Linking.openURL(
              `${API_BASE_URL}/payslip/${payrollId}/payslip/pdf?token=${token}`
            )
          }
        >
          <Feather name="download" size={18} color="#fff" />
          <Text style={styles.downloadText}> DOWNLOAD PDF </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= REUSABLE ROW ================= */

function Row({ label, value, danger }) {
  return (
    <View style={styles.line}>
      <Text style={styles.text}>{label}</Text>
      <Text
        style={[
          styles.amount,
          danger && { color: "#ef4444", fontWeight: "700" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
    paddingBottom: 600
  },

  headerCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: "#cbd5f5",
    fontSize: 12,
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  text: {
    color: "#6b7280",
  },
  amount: {
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10,
  },

  netCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  netLabel: {
    fontWeight: "800",
    color: "#065f46",
  },
  netAmount: {
    fontWeight: "900",
    color: "#059669",
    fontSize: 16,
  },

  downloadBtn: {
  marginTop: 20,
  marginBottom: 24, // 🔥 ensures full visibility
  backgroundColor: "#ef4444",
  padding: 16,
  borderRadius: 14,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},
  downloadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },
});

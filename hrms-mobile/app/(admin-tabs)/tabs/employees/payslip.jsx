// import { View, Text, Button } from "react-native";
// import { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import { API_BASE_URL } from "../../../../constants/api";
// import { useAuthStore } from "../../../../store/authStore";
// import * as Linking from "expo-linking";

// export default function Payslip() {
//   const { payrollId } = useLocalSearchParams();
//   const { token } = useAuthStore();
//   const [payslip, setPayslip] = useState(null);

//   useEffect(() => {
//     fetchPayslip();
//   }, []);

//   const fetchPayslip = async () => {
//     const res = await axios.get(
//       `${API_BASE_URL}/payslip/${payrollId}/payslip`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setPayslip(res.data);
//   };

//   if (!payslip) return <Text>Loading...</Text>;

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ fontSize: 18 }}>Payslip</Text>

//       <Text>Employee: {payslip.employee.name}</Text>
//       <Text>Month: {payslip.company.month}</Text>

//       <Text style={{ marginTop: 10 }}>Salary</Text>
//       <Text>Basic: ₹{payslip.salary.basicSalary}</Text>
//       <Text>Deductions: ₹{payslip.salary.deductions}</Text>
//       <Text>Net: ₹{payslip.salary.netSalary}</Text>

//       <Button
//         title="Download PDF"
//         onPress={() =>
//           Linking.openURL(
//             `${API_BASE_URL}/payslip/${payrollId}/payslip/pdf?token=${token}`
//           )
//         }
//       />
//     </View>
//   );
// }

// import { View, Text, Button } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { API_BASE_URL } from "../../../constants/api";
// import { useAuthStore } from "../../../store/authStore";
// import * as Linking from "expo-linking";

// export default function Payslip() {
//   const { payrollId } = useLocalSearchParams();
//   const { token } = useAuthStore();

//   const downloadPDF = () => {
//     const url =
//       `${API_BASE_URL}/payroll/${payrollId}/payslip/pdf?token=${token}`;

//     Linking.openURL(url);
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>
//         Payslip
//       </Text>

//       <Button title="Download PDF" onPress={downloadPDF} />
//     </View>
//   );
// }

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
        { headers: { Authorization: `Bearer ${token}` } }
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

  const { employee, company, salary } = payslip;

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
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
          <View>
            <Text style={styles.label}>Payment Date</Text>
            <Text style={styles.value}>
              {new Date(company.paymentDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Salary Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakTitle}>₹ Salary Breakdown</Text>

        <View style={styles.line}>
          <Text style={styles.text}>Basic Salary</Text>
          <Text style={styles.amount}>₹{salary.basicSalary}</Text>
        </View>

        <View style={styles.line}>
          <Text style={styles.text}>Other Deductions</Text>
          <Text style={styles.amount}>₹{salary.deductions}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.line}>
          <Text style={styles.total}>Total Deductions</Text>
          <Text style={[styles.total, { color: "#ef4444" }]}>
            ₹{salary.deductions}
          </Text>
        </View>

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net Salary Payable</Text>
          <Text style={styles.netAmount}>₹{salary.netSalary}</Text>
        </View>
      </View>

      {/* Download Button */}
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={() =>
          Linking.openURL(
            `${API_BASE_URL}/payslip/${payrollId}/payslip/pdf?token=${token}`
          )
        }
      >
        <Feather name="download" size={18} color="#fff" />
        <Text style={styles.downloadText}> DOWNLOAD PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
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

  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  breakTitle: {
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
    marginVertical: 8,
  },

  total: {
    fontWeight: "700",
  },

  netRow: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  netLabel: {
    fontWeight: "700",
  },
  netAmount: {
    fontWeight: "800",
    color: "#34a756",
  },

  downloadBtn: {
    marginTop: 20,
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
  },
});

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";

export default function EmployeePayroll() {
  const router = useRouter();
  const { token, employeeId: myEmployeeId } = useAuthStore();
  const { employeeId } = useLocalSearchParams();
  const finalEmployeeId = employeeId || myEmployeeId;

  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    if (finalEmployeeId) fetchPayrolls();
  }, [finalEmployeeId]);

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/employee/${finalEmployeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayrolls(res.data?.payrolls || []);
    } catch (err) {
      console.log("FETCH PAYROLL ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load payrolls");
    }
  };

  const getColor = (amount) => (amount > 0 ? "#22c55e" : "#f59e0b");

  return (
    <View style={styles.page}>
      <Text style={styles.title}>All Payrolls</Text>

      {payrolls.length === 0 && (
        <Text style={styles.empty}>No payroll records found</Text>
      )}

      <FlatList
        data={payrolls}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(admin-tabs)/tabs/employees/payslip",
                params: { payrollId: item._id },
              })
            }
          >
            {/* Left color bar */}
            <View
              style={[
                styles.sideBar,
                { backgroundColor: getColor(item.netSalary) },
              ]}
            />

            {/* Left content */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.employeeName}</Text>

              <View style={styles.row}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.sub}>Month: {item.month}</Text>
              </View>
            </View>

            {/* Right salary */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.amount,
                  { color: getColor(item.netSalary) },
                ]}
              >
                ₹{item.netSalary}
              </Text>
              <Text style={styles.sub}>Net Salary</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  sideBar: {
    width: 4,
    height: "100%",
    borderRadius: 10,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 4,
  },

  sub: {
    fontSize: 12,
    color: "#64748b",
  },

  amount: {
    fontSize: 18,
    fontWeight: "800",
  },
});

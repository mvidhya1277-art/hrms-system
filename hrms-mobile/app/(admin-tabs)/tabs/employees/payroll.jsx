import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";

export default function EmployeePayroll() {
  const { employeeId, employeeName } = useLocalSearchParams();
  const { token } = useAuthStore();
  const router = useRouter();

  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    if (employeeId) fetchPayrolls();
  }, [employeeId]);

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/employee/${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayrolls(res.data || []);
    } catch (err) {
      console.log("FETCH PAYROLL ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load payrolls");
    }
  };

  return (
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Payroll – {employeeName}
      </Text>

      {payrolls.length === 0 && (
        <Text style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
          No payroll records found
        </Text>
      )}

      <FlatList
        data={payrolls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "tabs//employees/payslip",
                params: { payrollId: item._id },
              })
            }
            style={{
              padding: 12,
              borderWidth: 1,
              marginBottom: 8,
              borderRadius: 6,
            }}
          >
            <Text>Month: {item.month}</Text>
            <Text>Net Salary: ₹{item.netSalary}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

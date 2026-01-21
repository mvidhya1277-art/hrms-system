import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";
import { useRouter } from "expo-router";

export default function AdminPayrollList() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/payroll/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayrolls(res.data || []);
    } catch (err) {
      console.log("FETCH ALL PAYROLLS ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        All Payrolls
      </Text>

      <FlatList
        data={payrolls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/employees/payslip",
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
            <Text>{item.employeeName}</Text>
            <Text>Month: {item.month}</Text>
            <Text>Net Salary: ₹{item.netSalary}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

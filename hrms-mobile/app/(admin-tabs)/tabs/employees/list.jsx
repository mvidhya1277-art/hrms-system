import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../constants/api";
import { useAuthStore } from "../../../../store/authStore";

export default function EmployeeListByFilter() {
  const { filter } = useLocalSearchParams();
  const { token } = useAuthStore();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [filter]);

  const fetchEmployees = async () => {
    const res = await axios.get(
      `${API_BASE_URL}/employees/list?filter=${filter}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEmployees(res.data || []);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
        {filter?.toUpperCase()} Employees
      </Text>

      <FlatList
        data={employees}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              backgroundColor: "#fff",
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ color: "#64748b" }}>{item.empCode}</Text>
          </View>
        )}
      />
    </View>
  );
}

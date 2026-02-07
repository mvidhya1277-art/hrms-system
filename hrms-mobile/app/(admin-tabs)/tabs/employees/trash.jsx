import { FlatList, Text, TouchableOpacity, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../../store/authStore";
import { API_BASE_URL } from "../../../../constants/api";
import { Ionicons } from "@expo/vector-icons";

export default function TrashEmployees() {
  const { token } = useAuthStore();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/employees?deleted=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data || []);
    } catch (err) {
      console.log("FETCH DELETED ERROR:", err.response?.data || err.message);
    }
  };

  const restoreEmployee = (id) => {
    Alert.alert(
      "Restore Employee",
      "Do you want to restore this employee?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await axios.patch(
                `${API_BASE_URL}/employees/restore/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              // remove from trash list
              setEmployees((prev) => prev.filter((e) => e._id !== id));
            } catch (err) {
              Alert.alert(
                "Error",
                err.response?.data?.message || "Restore failed"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f8fafc" }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 12,
        }}
      >
        Deleted Employees
      </Text>

      {employees.length === 0 && (
        <Text style={{ textAlign: "center", color: "#64748b", marginTop: 40 }}>
          No deleted employees
        </Text>
      )}

      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#94a3b8",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                {item.name[0]}
              </Text>
            </View>

            {/* Name */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 13 }}>
                {item.empCode}
              </Text>
            </View>

            {/* Restore */}
            <TouchableOpacity
              onPress={() => restoreEmployee(item._id)}
              style={{
                backgroundColor: "#dcfce7",
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons name="refresh" size={18} color="#16a34a" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

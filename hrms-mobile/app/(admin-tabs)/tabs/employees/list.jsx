import { View, Text, FlatList, StyleSheet } from "react-native";
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
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEmployees(res.data || []);
  };

  const getAvatarColor = (name) => {
    const colors = ["#3b82f6", "#22c55e", "#8b5cf6", "#f97316", "#ef4444"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Employees List</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{employees.length} Employees</Text>
        </View>
      </View>

      <FlatList
        data={employees}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Green side bar */}
            <View style={styles.sideBar} />

            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                { backgroundColor: getAvatarColor(item.name) },
              ]}
            >
              <Text style={styles.avatarText}>
                {item.name?.charAt(0)}
              </Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.code}>ID {item.empCode}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },

  sideBar: {
    width: 4,
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 10,
    marginRight: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  code: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 4,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: "#16a34a",
    fontSize: 11,
    fontWeight: "600",
  },
});


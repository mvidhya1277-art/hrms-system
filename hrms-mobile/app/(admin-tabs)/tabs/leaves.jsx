import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";

export default function AdminLeaves() {
  const { token } = useAuthStore();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("history"); // history | pending
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data || []);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (leaveId, status) => {
    try {
      setActionLoadingId(leaveId);
      await axios.put(
        `${API_BASE_URL}/leaves/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaves();
    } catch {
      Alert.alert("Error", "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredLeaves =
    tab === "pending"
      ? leaves.filter(l => l.status === "pending")
      : leaves;

  const renderLeave = ({ item }) => {
    const emp = item.employeeId;
    const initials = emp?.name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

    const statusColor =
      item.status === "approved"
        ? "#22c55e"
        : item.status === "rejected"
        ? "#ef4444"
        : "#f59e0b";

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{emp?.name}</Text>
            <Text style={styles.code}>{emp?.empCode}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
            <Text style={{ color: statusColor, fontWeight: "700" }}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Leave Type</Text>
          <Text style={styles.value}>{item.leaveType}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{item.fromDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{item.toDate}</Text>
        </View>

        <View style={styles.reasonBox}>
          <Text style={styles.label}>Reason</Text>
          <Text style={styles.reason}>{item.reason}</Text>
        </View>

        {/* ACTIONS */}
        {item.status === "pending" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.accept}
              onPress={() => updateStatus(item._id, "approved")}
              disabled={actionLoadingId === item._id}
            >
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reject}
              onPress={() => updateStatus(item._id, "rejected")}
              disabled={actionLoadingId === item._id}
            >
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.pageTitle}>Leave Management</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "history" && styles.activeTab]}
          onPress={() => setTab("history")}
        >
          <Text style={tab === "history" ? styles.activeText : styles.tabText}>
            Leave History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "pending" && styles.activeTab]}
          onPress={() => setTab("pending")}
        >
          <Text style={tab === "pending" ? styles.activeText : styles.tabText}>
            Pending Approval
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredLeaves}
        keyExtractor={item => item._id}
        renderItem={renderLeave}
        ListEmptyComponent={<Text>No records found</Text>}
      />
    </View>
  );
}

const styles = {
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },

  tabText: { color: "#64748b", fontWeight: "600" },
  activeText: { color: "#ef4444", fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: { color: "#fff", fontWeight: "800" },

  name: { fontWeight: "700", fontSize: 15 },
  code: { fontSize: 12, color: "#64748b" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: { color: "#64748b", fontSize: 12 },
  value: { fontWeight: "600" },

  reasonBox: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  reason: { fontSize: 13 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  accept: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },

  reject: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },

  actionText: { color: "#fff", fontWeight: "700" },
};

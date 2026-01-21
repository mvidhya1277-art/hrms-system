import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../constants/api";

export default function MyLeaves() {
  const { token } = useAuthStore();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveType, setLeaveType] = useState("full");

  // 🔄 Fetch my leaves
  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/leaves/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data);
    } catch (err) {
      console.log("Fetch leaves error", err.response?.data);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  // ➕ Apply leave
  const applyLeave = async () => {
    if (!fromDate || !toDate || !reason) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (leaveType === "half" && fromDate !== toDate) {
      Alert.alert(
        "Invalid Half Day Leave",
        "Half-day leave must be for a single date"
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/leaves/apply`,
        {
          fromDate,
          toDate,
          reason,
          leaveType, // ✅ NOW SENT
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Leave applied successfully");

      setFromDate("");
      setToDate("");
      setReason("");
      setLeaveType("full");

      fetchMyLeaves();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Leave apply failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderLeave = ({ item }) => (
    <View
      style={{
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
      }}
    >
      <Text>
        📅 {item.fromDate} → {item.toDate}
      </Text>
      <Text>📝 {item.reason}</Text>
      <Text>
        📌 Status:{" "}
        {item.status === "pending"
          ? "⏳ Pending"
          : item.status === "approved"
            ? "✅ Approved"
            : "❌ Rejected"}
      </Text>
    </View>
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Apply Leave
      </Text>

      <TextInput
        placeholder="From Date (YYYY-MM-DD)"
        value={fromDate}
        onChangeText={setFromDate}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="To Date (YYYY-MM-DD)"
        value={toDate}
        onChangeText={setToDate}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Reason"
        value={reason}
        onChangeText={setReason}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          height: 60,
        }}
        multiline
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setLeaveType("full")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: leaveType === "full" ? "#4CAF50" : "#ccc",
            marginRight: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>
            Full Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setLeaveType("half")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: leaveType === "half" ? "#FF9800" : "#ccc",
            marginLeft: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>
            Half Day
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        title={loading ? "Applying..." : "Apply Leave"}
        onPress={applyLeave}
        disabled={loading}
      />

      <Text style={{ fontSize: 18, marginVertical: 15 }}>
        My Leaves
      </Text>

      <FlatList
        data={leaves}
        keyExtractor={(item) => item._id}
        renderItem={renderLeave}
        ListEmptyComponent={
          <Text>No leaves applied yet</Text>
        }
      />
    </View>
  );
}

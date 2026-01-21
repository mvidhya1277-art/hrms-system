import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store/authStore";
import EmployeeCalendar from "../../(admin-tabs)/tabs/employees/calendar";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../../../constants/api";

export default function AdminProfile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [leaveType, setLeaveType] = useState("FULL");
  const [reason, setReason] = useState("");
  const token = useAuthStore((s) => s.token);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const applyAdminLeave = async () => {
    try {
      if (toDate < fromDate) {
        alert("To date cannot be before from date");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/leaves/admin/apply`,
        {
          fromDate,
          toDate,
          leaveType,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Leave applied successfully");
      setShowLeaveModal(false);
      setReason("");
    } catch (err) {
      alert("Failed to apply leave");
    }
  };

  // ✅ MUST be inside the function
  if (!user) {
    return null; // prevents crash after logout
  }

  const handleLogout = async () => {
    await logout();
    setTimeout(() => {
      router.replace("/login");
    }, 0);
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>

      <View style={styles.card}>
        <ProfileRow label="Name" value={user.name} />
        <ProfileRow label="Phone" value={user.phone} />
        <ProfileRow label="Role" value="Admin" />
        <ProfileRow label="Company" value={user.companyName} />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          My Attendance
        </Text>

        <EmployeeCalendar
          key={user.employeeId}
          employeeId={user.employeeId}
          employeeName={user.name}
        />
      </View>
      <View style={{ marginTop: 25 }}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            setFromDate(new Date());
            setToDate(new Date());
            setLeaveType("FULL");
            setReason("");
            setShowLeaveModal(true);
          }}>
          <Text style={styles.applyBtnText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showLeaveModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Apply Leave</Text>

            {/* FROM DATE */}
            <Text style={styles.modalLabel}>From Date</Text>
            <TouchableOpacity onPress={() => setShowFromPicker(true)}>
              <Text style={styles.dateText}>
                {fromDate.toDateString()}
              </Text>
            </TouchableOpacity>

            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={(e, d) => {
                  setShowFromPicker(false);
                  if (d) {
                    const selected = new Date(d);
                    selected.setHours(0, 0, 0, 0);
                    setFromDate(selected);

                    // auto-fix toDate if needed
                    if (selected > toDate) {
                      setToDate(selected);
                    }
                  }
                }}
              />
            )}

            {/* TO DATE */}
            <Text style={styles.modalLabel}>To Date</Text>
            <TouchableOpacity onPress={() => setShowToPicker(true)}>
              <Text style={styles.dateText}>
                {toDate.toDateString()}
              </Text>
            </TouchableOpacity>

            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                minimumDate={fromDate}
                onChange={(e, d) => {
                  setShowToPicker(false);
                  if (d) {
                    const selected = new Date(d);
                    selected.setHours(0, 0, 0, 0);
                    setToDate(selected);
                  }
                }}
              />
            )}

            <Text style={styles.modalLabel}>Leave Type</Text>
            <View style={styles.typeRow}>
              <Text
                onPress={() => setLeaveType("full")}
                style={leaveType === "full" ? styles.activeType : styles.type}
              >
                Full Day
              </Text>

              <Text
                onPress={() => setLeaveType("half")}
                style={leaveType === "half" ? styles.activeType : styles.type}
              >
                Half Day
              </Text>
            </View>

            <TextInput
              placeholder="Reason"
              value={reason}
              onChangeText={setReason}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Text onPress={() => setShowLeaveModal(false)} style={styles.cancelBtn}>
                Cancel
              </Text>
              <Text onPress={applyAdminLeave} style={styles.submitBtn}>
                Apply
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.actions}>
        <Text style={styles.logoutBtn} onPress={handleLogout}>
          Logout
        </Text>
      </View>
    </ScrollView>
  );
}

/* 🔹 Reusable row */
function ProfileRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  row: { marginBottom: 14 },
  label: { fontSize: 13, color: "#777" },
  value: { fontSize: 16, fontWeight: "500", marginTop: 2 },
  actions: { marginTop: 30 },
  logoutBtn: { color: "red", fontSize: 16, fontWeight: "600" },
  applyBtn: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  typeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  type: {
    marginRight: 20,
    color: "#666",
  },
  activeType: {
    marginRight: 20,
    color: "#4f46e5",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelBtn: {
    marginRight: 20,
    color: "#888",
  },
  submitBtn: {
    color: "#4f46e5",
    fontWeight: "700",
  },
});


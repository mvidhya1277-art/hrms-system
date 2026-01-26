import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store/authStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../../../constants/api";

export default function AdminProfile() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [leaveType, setLeaveType] = useState("FULL");
  const [reason, setReason] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  if (!user) return null;

  const applyAdminLeave = async () => {
    try {
      if (toDate < fromDate) {
        alert("To date cannot be before from date");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/leaves/admin/apply`,
        { fromDate, toDate, leaveType, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Leave applied successfully");
      setShowLeaveModal(false);
      setReason("");
    } catch (err) {
      alert("Failed to apply leave");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Top */}
      <View style={styles.profileTop}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>Admin</Text>
        <Text style={styles.company}>{user.companyName}</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Admin Profile</Text>

        <ProfileField label="Name" value={user.name} />
        <ProfileField label="Phone" value={user.phone} />
        <ProfileField label="Role" value="Admin" />
        <ProfileField label="Company" value={user.companyName} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push("/(admin-tabs)/tabs/employees/all-payrolls")
          }
        >
          <Text style={styles.primaryBtnText}>VIEW PAYROLL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => setShowLeaveModal(true)}
        >
          <Text style={styles.outlineBtnText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      {/* My Attendance */}
      <TouchableOpacity
        style={styles.attendanceBtn}
        onPress={() =>
          router.push("/(admin-tabs)/tabs/employees/calendar")
        }
      >
        <Text style={styles.attendanceText}>MY ATTENDANCE</Text>
      </TouchableOpacity>

      {/* Leave Modal */}
      <Modal visible={showLeaveModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Apply Leave</Text>

            <Text style={styles.modalLabel}>From Date</Text>
            <TouchableOpacity onPress={() => setShowFromPicker(true)}>
              <Text style={styles.dateText}>{fromDate.toDateString()}</Text>
            </TouchableOpacity>

            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                onChange={(e, d) => {
                  setShowFromPicker(false);
                  if (d) setFromDate(d);
                }}
              />
            )}

            <Text style={styles.modalLabel}>To Date</Text>
            <TouchableOpacity onPress={() => setShowToPicker(true)}>
              <Text style={styles.dateText}>{toDate.toDateString()}</Text>
            </TouchableOpacity>

            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                minimumDate={fromDate}
                onChange={(e, d) => {
                  setShowToPicker(false);
                  if (d) setToDate(d);
                }}
              />
            )}

            <Text style={styles.modalLabel}>Leave Type</Text>
            <View style={styles.typeRow}>
              <Text
                onPress={() => setLeaveType("FULL")}
                style={leaveType === "FULL" ? styles.activeType : styles.type}
              >
                Full Day
              </Text>
              <Text
                onPress={() => setLeaveType("HALF")}
                style={leaveType === "HALF" ? styles.activeType : styles.type}
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
              <Text
                onPress={() => setShowLeaveModal(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </Text>
              <Text onPress={applyAdminLeave} style={styles.submitBtn}>
                Apply
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* Profile Field */
function ProfileField({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },

  profileTop: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "700" },
  role: { color: "#e53935", fontWeight: "600", marginTop: 4 },
  company: { color: "#777" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: "#777" },
  fieldBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e53935",
  },
  fieldValue: { fontSize: 15, fontWeight: "600" },

  buttonRow: { flexDirection: "row", marginBottom: 16 },
  primaryBtn: {
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 30,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  outlineBtn: {
    borderWidth: 2,
    borderColor: "#e53935",
    padding: 14,
    borderRadius: 30,
    flex: 1,
    alignItems: "center",
  },
  outlineBtnText: { color: "#e53935", fontWeight: "700" },

  attendanceBtn: {
    backgroundColor: "#e53935",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  attendanceText: { color: "#fff", fontWeight: "700", fontSize: 16 },

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
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalLabel: { marginTop: 10, fontWeight: "500" },
  dateText: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginTop: 6,
  },
  typeRow: { flexDirection: "row", marginTop: 8 },
  type: { marginRight: 20, color: "#666" },
  activeType: { marginRight: 20, color: "#e53935", fontWeight: "700" },
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
  cancelBtn: { marginRight: 20, color: "#888" },
  submitBtn: { color: "#e53935", fontWeight: "700" },
});

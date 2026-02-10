import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import DashboardHeader from "../../../components/DashboardHeader";

export default function AttendanceRulesSettings() {
  const navigation = useNavigation();
  const { token } = useAuthStore();

  const [gracePeriodMinutes, setGracePeriodMinutes] = useState("");
  const [halfDayHours, setHalfDayHours] = useState("");
  const [absentHours, setAbsentHours] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceRules();
  }, []);

  /* ---------------- FETCH ---------------- */

  const fetchAttendanceRules = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/settings/attendance-rules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rules = res.data.attendanceRules;

      setGracePeriodMinutes(String(rules.gracePeriodMinutes ?? 0));
      setHalfDayHours(String(rules.halfDayHours ?? 4));
      setAbsentHours(String(rules.absentHours ?? 2));
    } catch (err) {
      Alert.alert("Error", "Failed to load attendance rules");
    }
  };

  /* ---------------- SAVE ---------------- */

  const saveRules = async () => {
    const grace = Number(gracePeriodMinutes);
    const half = Number(halfDayHours);
    const absent = Number(absentHours);

    if (
      isNaN(grace) ||
      isNaN(half) ||
      isNaN(absent) ||
      grace < 0 ||
      half <= 0 ||
      absent < 0
    ) {
      return Alert.alert("Validation", "Please enter valid numbers");
    }

    if (absent >= half) {
      return Alert.alert(
        "Validation",
        "Absent hours must be less than half day hours"
      );
    }

    try {
      setLoading(true);

      await axios.put(
        `${API_BASE_URL}/settings/attendance-rules`,
        {
          gracePeriodMinutes: grace,
          halfDayHours: half,
          absentHours: absent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Attendance rules updated");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <SafeAreaView edges={["top"]}>
          <DashboardHeader
            title="Attendance Rules"
            onMenuPress={() =>
              navigation.dispatch(DrawerActions.openDrawer())
            }
          />
        </SafeAreaView>

        {/* RULES CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Late & Working Hour Rules</Text>

          <Text style={styles.label}>Grace Period (minutes)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={gracePeriodMinutes}
            onChangeText={setGracePeriodMinutes}
            placeholder="e.g. 10"
          />

          <Text style={styles.label}>Half Day if working hours less than</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={halfDayHours}
            onChangeText={setHalfDayHours}
            placeholder="e.g. 4"
          />

          <Text style={styles.label}>Absent if working hours less than</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={absentHours}
            onChangeText={setAbsentHours}
            placeholder="e.g. 2"
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={saveRules}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Saving..." : "Save Rules"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 16,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
};

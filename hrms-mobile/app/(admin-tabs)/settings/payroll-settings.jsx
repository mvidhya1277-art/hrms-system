import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import DashboardHeader from "../../../components/DashboardHeader";

export default function PayrollSettings() {
  const navigation = useNavigation();
  const { token } = useAuthStore();

  /* ---------------- STATE ---------------- */

  // PF
  const [pfEnabled, setPfEnabled] = useState(false);
  const [pfEmployee, setPfEmployee] = useState("12");

  // ESI
  const [esiEnabled, setEsiEnabled] = useState(false);
  const [esiEmployee, setEsiEmployee] = useState("0.75");
  const [esiSalaryLimit, setEsiSalaryLimit] = useState("21000");

  // Professional Tax
  const [ptEnabled, setPtEnabled] = useState(false);
  const [ptAmount, setPtAmount] = useState("0");

  // Payslip
  const [showPF, setShowPF] = useState(true);
  const [showESI, setShowESI] = useState(true);
  const [showPT, setShowPT] = useState(true);
  const [footerNote, setFooterNote] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayrollSettings();
  }, []);

  /* ---------------- FETCH ---------------- */

  const fetchPayrollSettings = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/settings/payroll-settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const s = res.data.settings;
      if (!s) return;

      setPfEnabled(s.pf?.enabled ?? false);
      setPfEmployee(String(s.pf?.employeePercent ?? 12));

      setEsiEnabled(s.esi?.enabled ?? false);
      setEsiEmployee(String(s.esi?.employeePercent ?? 0.75));
      setEsiSalaryLimit(String(s.esi?.salaryLimit ?? 21000));

      setPtEnabled(s.professionalTax?.enabled ?? false);
      setPtAmount(
        String(s.professionalTax?.slabs?.[0]?.amount ?? 0)
      );

      setShowPF(s.payslip?.showPF ?? true);
      setShowESI(s.payslip?.showESI ?? true);
      setShowPT(s.payslip?.showProfessionalTax ?? true);
      setFooterNote(s.payslip?.footerNote ?? "");
    } catch {
      Alert.alert("Error", "Failed to load payroll settings");
    }
  };

  /* ---------------- SAVE ---------------- */

  const saveSettings = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${API_BASE_URL}/settings/payroll-settings`,
        {
          pf: {
            enabled: pfEnabled,
            employeePercent: Number(pfEmployee),
          },
          esi: {
            enabled: esiEnabled,
            employeePercent: Number(esiEmployee),
            salaryLimit: Number(esiSalaryLimit),
          },
          professionalTax: {
            enabled: ptEnabled,
            slabs: ptEnabled
              ? [{ min: 0, max: 999999, amount: Number(ptAmount) }]
              : [],
          },
          payslip: {
            showPF,
            showESI,
            showProfessionalTax: showPT,
            footerNote,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Payroll settings updated");
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
            title="Payroll Settings"
            onMenuPress={() =>
              navigation.dispatch(DrawerActions.openDrawer())
            }
          />
        </SafeAreaView>

        {/* PF */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Provident Fund (PF)</Text>
          <SwitchRow label="Enable PF" value={pfEnabled} onChange={setPfEnabled} />
          {pfEnabled && (
            <TextInput
              style={styles.input}
              value={pfEmployee}
              onChangeText={setPfEmployee}
              keyboardType="numeric"
              placeholder="Employee PF %"
            />
          )}
        </View>

        {/* ESI */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ESI</Text>
          <SwitchRow label="Enable ESI" value={esiEnabled} onChange={setEsiEnabled} />
          {esiEnabled && (
            <>
              <TextInput
                style={styles.input}
                value={esiEmployee}
                onChangeText={setEsiEmployee}
                keyboardType="numeric"
                placeholder="Employee ESI %"
              />
              <TextInput
                style={styles.input}
                value={esiSalaryLimit}
                onChangeText={setEsiSalaryLimit}
                keyboardType="numeric"
                placeholder="Salary Limit"
              />
            </>
          )}
        </View>

        {/* PROFESSIONAL TAX */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Tax</Text>
          <SwitchRow label="Enable PT" value={ptEnabled} onChange={setPtEnabled} />
          {ptEnabled && (
            <TextInput
              style={styles.input}
              value={ptAmount}
              onChangeText={setPtAmount}
              keyboardType="numeric"
              placeholder="Monthly PT Amount"
            />
          )}
        </View>

        {/* PAYSLIP */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payslip</Text>
          <SwitchRow label="Show PF" value={showPF} onChange={setShowPF} />
          <SwitchRow label="Show ESI" value={showESI} onChange={setShowESI} />
          <SwitchRow label="Show Professional Tax" value={showPT} onChange={setShowPT} />

          <TextInput
            style={[styles.input, styles.textArea]}
            value={footerNote}
            onChangeText={setFooterNote}
            placeholder="Footer Note"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={saveSettings}>
          <Text style={styles.btnText}>
            {loading ? "Saving..." : "Save Settings"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SwitchRow({ label, value, onChange }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
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
  cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  textArea: { minHeight: 80 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  switchLabel: { fontSize: 16, fontWeight: "600" },
  btn: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 14,
    margin: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
};

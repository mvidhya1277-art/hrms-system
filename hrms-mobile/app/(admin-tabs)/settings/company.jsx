// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Switch,
// } from "react-native";
// import { useEffect, useState } from "react";
// import { useNavigation } from "expo-router";
// import { DrawerActions } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import axios from "axios";

// import { useAuthStore } from "../../../store/authStore";
// import { API_BASE_URL } from "../../../constants/api";
// import DashboardHeader from "../../../components/DashboardHeader";

// export default function CompanySettings() {
//   const navigation = useNavigation();
//   const { token } = useAuthStore();

//   const [companyName, setCompanyName] = useState("");//officeTimings
//   const [address, setAddress] = useState("");
//   const [officeStart, setOfficeStart] = useState("");
//   const [officeEnd, setOfficeEnd] = useState("");

//   const [secondSaturdayOff, setSecondSaturdayOff] = useState(true);
//   const [fourthSaturdayOff, setFourthSaturdayOff] = useState(true);

//   const [loading, setLoading] = useState(false);
//   const [sundayOff, setSundayOff] = useState(true);
//   // const saturdayEnabled = offWeeks.length > 0; offWeeks 
//   useEffect(() => {
//     fetchCompanySettings();
//   }, []);

//   /* ---------------- FETCH ---------------- */

//   const fetchCompanySettings = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/settings/company`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const data = res.data.data;

//       setCompanyName(data.companyName || "");
//       setAddress(data.address || "");
//       setOfficeStart(data.officeTimings?.startTime || "");
//       setOfficeEnd(data.officeTimings?.endTime || "");

//       const offWeeks = data.weekends?.saturday?.offWeeks || [];
//       setSecondSaturdayOff(offWeeks.includes(2));
//       setFourthSaturdayOff(offWeeks.includes(4));
//       setSundayOff(data.weekends?.sundayOff ?? true);

//     } catch {
//       Alert.alert("Error", "Failed to load company settings");
//     }
//   };

//   /* ---------------- SAVE ---------------- */


//   const saveSettings = async () => {
//     if (!officeStart || !officeEnd) {
//       return Alert.alert("Validation", "Office timings required");
//     }

//     const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
//     if (!timeRegex.test(officeStart) || !timeRegex.test(officeEnd)) {
//       return Alert.alert("Validation", "Time must be in HH:mm format");
//     }

//     const offWeeks = [];
//     if (secondSaturdayOff) offWeeks.push(2);
//     if (fourthSaturdayOff) offWeeks.push(4);

//     const saturdayEnabled = offWeeks.length > 0;

//     try {
//       setLoading(true);

//       await axios.put(
//         `${API_BASE_URL}/settings/company`,
//         {
//           address,
//           officeTimings: {
//             startTime: officeStart,
//             endTime: officeEnd,
//           },
//           weekends: {
//             sundayOff,
//             saturday: {
//               enabled: saturdayEnabled,
//               offWeeks,
//             },
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       Alert.alert("Success", "Company settings updated");
//     } catch (err) {
//       Alert.alert(
//         "Error",
//         err.response?.data?.message || "Update failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   /* ---------------- UI ---------------- */

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
//       >
//         <SafeAreaView edges={["top"]}>
//           <DashboardHeader
//             title="Company Settings"
//             onMenuPress={() =>
//               navigation.dispatch(DrawerActions.openDrawer())
//             }
//           />
//         </SafeAreaView>

//         {/* COMPANY INFO */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Company Information</Text>

//           <Text style={styles.label}>Company Name</Text>
//           <TextInput
//             style={[styles.input, styles.disabled]}
//             value={companyName}
//             editable={false}
//           />

//           <Text style={styles.label}>Address</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             value={address}
//             onChangeText={setAddress}
//             multiline
//           />
//         </View>

//         {/* OFFICE TIMINGS */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Office Timings</Text>

//           <Text style={styles.label}>Start Time (HH:mm)</Text>
//           <TextInput
//             style={styles.input}
//             value={officeStart}
//             onChangeText={setOfficeStart}
//             placeholder="09:30"
//           />

//           <Text style={styles.label}>End Time (HH:mm)</Text>
//           <TextInput
//             style={styles.input}
//             value={officeEnd}
//             onChangeText={setOfficeEnd}
//             placeholder="18:30"
//           />
//         </View>

//         {/* WEEKENDS */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Weekend Configuration</Text>

//           <WeekendRow
//             label="Sunday Off"
//             value={sundayOff}
//             onChange={setSundayOff}
//           />

//           <WeekendRow
//             label="2nd Saturday Off"
//             value={secondSaturdayOff}
//             onChange={setSecondSaturdayOff}
//           />

//           <WeekendRow
//             label="4th Saturday Off"
//             value={fourthSaturdayOff}
//             onChange={setFourthSaturdayOff}
//           />
//         </View>


//         {/* SAVE */}
//         <TouchableOpacity
//           style={[styles.btn, loading && { opacity: 0.6 }]}
//           onPress={saveSettings}
//           disabled={loading}
//         >
//           <Text style={styles.btnText}>
//             {loading ? "Saving..." : "Save Settings"}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// /* -------- WEEKEND ROW -------- */
// function WeekendRow({ label, value, onChange }) {
//   return (
//     <View style={styles.switchRow}>
//       <Text style={styles.switchLabel}>{label}</Text>
//       <Switch value={value} onValueChange={onChange} />
//     </View>
//   );
// }

// /* -------- STYLES -------- */
// const styles = {
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     margin: 16,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   label: {
//     fontWeight: "600",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//   },
//   textArea: {
//     minHeight: 80,
//     textAlignVertical: "top",
//   },
//   disabled: {
//     backgroundColor: "#f1f5f9",
//     color: "#64748b",
//   },
//   switchRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   switchLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   btn: {
//     backgroundColor: "#ef4444",
//     padding: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginTop: 10,
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// };

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

export default function CompanySettings() {
  const navigation = useNavigation();
  const { token } = useAuthStore();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [officeStart, setOfficeStart] = useState("");
  const [officeEnd, setOfficeEnd] = useState("");

  const [sundayOff, setSundayOff] = useState(true);

  // 🔥 NEW: Saturday mode
  const [saturdayMode, setSaturdayMode] = useState("working"); 
  // "working" | "all" | "custom"

  const [secondSaturdayOff, setSecondSaturdayOff] = useState(false);
  const [fourthSaturdayOff, setFourthSaturdayOff] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  /* ---------------- FETCH ---------------- */

  const fetchCompanySettings = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/settings/company`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.data;

      setCompanyName(data.companyName || "");
      setAddress(data.address || "");
      setOfficeStart(data.officeTimings?.startTime || "");
      setOfficeEnd(data.officeTimings?.endTime || "");

      setSundayOff(data.weekends?.sundayOff ?? true);

      const saturday = data.weekends?.saturday;

      if (!saturday?.enabled) {
        setSaturdayMode("working");
      } else if (saturday.offWeeks?.length === 5) {
        setSaturdayMode("all");
      } else {
        setSaturdayMode("custom");
        setSecondSaturdayOff(saturday.offWeeks.includes(2));
        setFourthSaturdayOff(saturday.offWeeks.includes(4));
      }
    } catch {
      Alert.alert("Error", "Failed to load company settings");
    }
  };

  /* ---------------- SAVE ---------------- */

  const saveSettings = async () => {
    if (!officeStart || !officeEnd) {
      return Alert.alert("Validation", "Office timings required");
    }

    const offWeeks = [];

    if (saturdayMode === "all") {
      offWeeks.push(1, 2, 3, 4, 5);
    }

    if (saturdayMode === "custom") {
      if (secondSaturdayOff) offWeeks.push(2);
      if (fourthSaturdayOff) offWeeks.push(4);
    }

    const saturdayEnabled = saturdayMode !== "working";

    try {
      setLoading(true);

      await axios.put(
        `${API_BASE_URL}/settings/company`,
        {
          address,
          officeTimings: {
            startTime: officeStart,
            endTime: officeEnd,
          },
          weekends: {
            sundayOff,
            saturday: {
              enabled: saturdayEnabled,
              offWeeks,
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Company settings updated");
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
            title="Company Settings"
            onMenuPress={() =>
              navigation.dispatch(DrawerActions.openDrawer())
            }
          />
        </SafeAreaView>

        {/* COMPANY INFO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Company Information</Text>

          <Text style={styles.label}>Company Name</Text>
          <TextInput style={[styles.input, styles.disabled]} value={companyName} editable={false} />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* OFFICE TIMINGS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Office Timings</Text>

          <Text style={styles.label}>Start Time</Text>
          <TextInput style={styles.input} value={officeStart} onChangeText={setOfficeStart} />

          <Text style={styles.label}>End Time</Text>
          <TextInput style={styles.input} value={officeEnd} onChangeText={setOfficeEnd} />
        </View>

        {/* WEEKENDS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekend Configuration</Text>

          <WeekendRow label="Sunday Off" value={sundayOff} onChange={setSundayOff} />

          <WeekendRow
            label="Saturday Working"
            value={saturdayMode === "working"}
            onChange={() => setSaturdayMode("working")}
          />

          <WeekendRow
            label="All Saturdays Off"
            value={saturdayMode === "all"}
            onChange={() => setSaturdayMode("all")}
          />

          <WeekendRow
            label="Custom Saturdays"
            value={saturdayMode === "custom"}
            onChange={() => setSaturdayMode("custom")}
          />

          {saturdayMode === "custom" && (
            <>
              <WeekendRow
                label="2nd Saturday Off"
                value={secondSaturdayOff}
                onChange={setSecondSaturdayOff}
              />
              <WeekendRow
                label="4th Saturday Off"
                value={fourthSaturdayOff}
                onChange={setFourthSaturdayOff}
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.btn} onPress={saveSettings}>
          <Text style={styles.btnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function WeekendRow({ label, value, onChange }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = {
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, margin: 16 },
  cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 16 },
  textArea: { minHeight: 80 },
  disabled: { backgroundColor: "#f1f5f9" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  switchLabel: { fontSize: 16, fontWeight: "600" },
  btn: { backgroundColor: "#ef4444", padding: 16, borderRadius: 14, margin: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
};

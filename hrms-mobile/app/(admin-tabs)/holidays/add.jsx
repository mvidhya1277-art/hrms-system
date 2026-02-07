// // import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// // import { useState } from "react";
// // import { useRouter } from "expo-router";
// // import axios from "axios";
// // import { useAuthStore } from "../../../store/authStore";
// // import { API_BASE_URL } from "../../../constants/api";

// // export default function AddHoliday() {
// //   const router = useRouter();
// //   const { token } = useAuthStore();
// //   const [name, setName] = useState("");
// //   const [date, setDate] = useState("");

// //   const submit = async () => {
// //     try {
// //       await axios.post(
// //         `${API_BASE_URL}/holidays`,
// //         { name, date },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       Alert.alert("Success", "Holiday added");
// //       router.back();
// //     } catch (err) {
// //       Alert.alert("Error", err.response?.data?.message || "Failed");
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Add Holiday</Text>

// //       <TextInput
// //         placeholder="Holiday Name"
// //         value={name}
// //         onChangeText={setName}
// //         style={styles.input}
// //       />

// //       <TextInput
// //         placeholder="YYYY-MM-DD"
// //         value={date}
// //         onChangeText={setDate}
// //         style={styles.input}
// //       />

// //       <TouchableOpacity style={styles.btn} onPress={submit}>
// //         <Text style={styles.btnText}>Save Holiday</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
// //   title: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#cbd5e1",
// //     borderRadius: 10,
// //     padding: 12,
// //     marginBottom: 12,
// //   },
// //   btn: {
// //     backgroundColor: "#e74c3c",
// //     padding: 14,
// //     borderRadius: 10,
// //     alignItems: "center",
// //   },
// //   btnText: { color: "#fff", fontWeight: "600" },
// // });

// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     StyleSheet,
//     Modal,
//     Platform
// } from "react-native";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import axios from "axios";
// import { useAuthStore } from "../../../store/authStore";
// import { API_BASE_URL } from "../../../constants/api";
// import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function AddHoliday() {
//     const router = useRouter();
//     const { token } = useAuthStore();

//     const [name, setName] = useState("");
//     const [date, setDate] = useState("");
//     const [type, setType] = useState("Public Holiday");
//     const [desc, setDesc] = useState("");
//     const [showPicker, setShowPicker] = useState(false);

//     const submit = async () => {
//         if (!name || !date) {
//             Alert.alert("Validation", "Name and date required");
//             return;
//         }

//         try {
//             await axios.post(
//                 `${API_BASE_URL}/holidays`,
//                 { name, date, type, description: desc },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             Alert.alert("Success", "Holiday added");
//             router.back();
//         } catch (err) {
//             Alert.alert("Error", err.response?.data?.message || "Failed");
//         }
//     };

//     return (
//         <Modal transparent animationType="fade">
//             <View style={styles.overlay}>
//                 <View style={styles.modalCard}>
//                     {/* HEADER */}
//                     <View style={styles.header}>
//                         <Text style={styles.title}>Add New Holiday</Text>
//                         <TouchableOpacity onPress={() => router.back()}>
//                             <Ionicons name="close" size={22} color="#ef4444" />
//                         </TouchableOpacity>
//                     </View>

//                     {/* FORM */}
//                     <Text style={styles.label}>Holiday Name</Text>
//                     <TextInput
//                         placeholder="Enter holiday name"
//                         value={name}
//                         onChangeText={setName}
//                         style={styles.input}
//                     />

//                     {/* <Text style={styles.label}>Date</Text>
//           <View style={styles.inputWithIcon}>
//             <TextInput
//               placeholder="DD/MM/YYYY"
//               value={date}
//               onChangeText={setDate}
//               style={{ flex: 1 }}
//             />
//             <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
//           </View> */}
//                     <Text style={styles.label}>Date</Text>

//                     <TouchableOpacity
//                         style={styles.inputWithIcon}
//                         onPress={() => setShowPicker(true)}
//                     >
//                         <Text style={{ color: date ? "#000" : "#9ca3af" }}>
//                             {date || "Select date"}
//                         </Text>
//                         <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
//                     </TouchableOpacity>

//                     {showPicker && (
//                         <DateTimePicker
//                             value={date ? new Date(date) : new Date()}
//                             mode="date"
//                             display={Platform.OS === "ios" ? "inline" : "default"}
//                             onChange={(event, selectedDate) => {
//                                 setShowPicker(false);
//                                 if (selectedDate) {
//                                     const d = selectedDate.toISOString().slice(0, 10);
//                                     setDate(d);
//                                 }
//                             }}
//                         />
//                     )}


//                     <Text style={styles.label}>Holiday Type</Text>
//                     <View style={styles.pickerBox}>
//                         <Picker
//                             selectedValue={type}
//                             onValueChange={(v) => setType(v)}
//                         >
//                             <Picker.Item label="Public Holiday" value="Public Holiday" />
//                             <Picker.Item label="Company Holiday" value="Company Holiday" />
//                         </Picker>
//                     </View>


//                     <Text style={styles.label}>Description (Optional)</Text>
//                     <TextInput
//                         placeholder="Enter holiday description"
//                         value={desc}
//                         onChangeText={setDesc}
//                         style={[styles.input, { height: 80 }]}
//                         multiline
//                     />

//                     {/* ACTIONS */}
//                     <View style={styles.actions}>
//                         <TouchableOpacity style={styles.saveBtn} onPress={submit}>
//                             <Ionicons name="save-outline" size={18} color="#fff" />
//                             <Text style={styles.saveText}> Save Holiday</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.cancelBtn}
//                             onPress={() => router.back()}
//                         >
//                             <Ionicons name="close" size={18} color="#0f172a" />
//                             <Text style={styles.cancelText}> Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// }

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.35)",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//     },

//     modalCard: {
//         width: "100%",
//         backgroundColor: "#fff",
//         borderRadius: 18,
//         padding: 20,
//     },

//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 16,
//     },

//     title: {
//         fontSize: 18,
//         fontWeight: "700",
//     },

//     label: {
//         fontSize: 13,
//         color: "#475569",
//         marginBottom: 6,
//         marginTop: 10,
//     },

//     input: {
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         padding: 12,
//         backgroundColor: "#f9fafb",
//     },

//     inputWithIcon: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         backgroundColor: "#f9fafb",
//     },

//     pickerBox: {
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 12,
//         backgroundColor: "#f9fafb",
//     },

//     actions: {
//         flexDirection: "row",
//         marginTop: 20,
//         gap: 12,
//     },

//     saveBtn: {
//         flex: 1,
//         backgroundColor: "#ef4444",
//         padding: 14,
//         borderRadius: 12,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     saveText: { color: "#fff", fontWeight: "600" },

//     cancelBtn: {
//         flex: 1,
//         backgroundColor: "#f1f5f9",
//         padding: 14,
//         borderRadius: 12,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     cancelText: { color: "#0f172a", fontWeight: "600" },
// });

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";
import { API_BASE_URL } from "../../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

/* 👇 helper to format as DD/MM/YYYY */
const formatDate = (d) => {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AddHoliday() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // DD/MM/YYYY
  const [type, setType] = useState("Public Holiday");
  const [desc, setDesc] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const submit = async () => {
    if (!name || !date) {
      Alert.alert("Validation", "Name and date required");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/holidays`,
        { name, date, type, description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Holiday added");
      router.back();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed");
    }
  };

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Add New Holiday</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* FORM */}
          <Text style={styles.label}>Holiday Name</Text>
          <TextInput
            placeholder="Enter holiday name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: date ? "#000" : "#9ca3af" }}>
              {date || "DD/MM/YYYY"}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={
                date
                  ? new Date(date.split("/").reverse().join("-"))
                  : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setDate(formatDate(selectedDate)); // 👈 DD/MM/YYYY
                }
              }}
            />
          )}

          <Text style={styles.label}>Holiday Type</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={type} onValueChange={setType}>
              <Picker.Item label="Public Holiday" value="Public Holiday" />
              <Picker.Item label="Company Holiday" value="Company Holiday" />
            </Picker>
          </View>

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            placeholder="Enter holiday description"
            value={desc}
            onChangeText={setDesc}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveBtn} onPress={submit}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveText}> Save Holiday</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={18} color="#0f172a" />
              <Text style={styles.cancelText}> Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "700" },
  label: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    height: 46,
    justifyContent: "space-between",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
  },
  actions: { flexDirection: "row", marginTop: 20, gap: 12 },
  saveBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600" },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: { color: "#0f172a", fontWeight: "600" },
});
